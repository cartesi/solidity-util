// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { describe } from "mocha";
import { expect, use } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { solidity } from "ethereum-waffle";

import { WorkerManagerAuthManagerImpl } from "../src/types/WorkerManagerAuthManagerImpl";
import { WorkerManagerAuthManagerImpl__factory } from "../src/types/factories/WorkerManagerAuthManagerImpl__factory";
import { getState } from "./getState";

use(solidity);

describe("WorkerManagerAuthManager", async () => {
    let enableDelegate = process.env["DELEGATE_TEST"];

    let initialState: string;

    let instanceUser: WorkerManagerAuthManagerImpl;
    let instanceWorker: WorkerManagerAuthManagerImpl;

    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

    beforeEach(async () => {
        await deployments.fixture();

        const [user, worker] = await ethers.getSigners();

        const address = (await deployments.get("WorkerManagerAuthManagerImpl"))
            .address;
        instanceUser = WorkerManagerAuthManagerImpl__factory.connect(
            address,
            user
        );
        instanceWorker = WorkerManagerAuthManagerImpl__factory.connect(
            address,
            worker
        );

        if (enableDelegate) {
            initialState = JSON.stringify({
                worker_address: worker.address,
                worker_manager_address: address,
            });
        }
    });

    const expectState = async (
        instance: WorkerManagerAuthManagerImpl,
        worker: string,
        isAvailable: boolean,
        isPending: boolean,
        isOwned: boolean,
        isRetired: boolean
    ) => {
        expect(
            await instance.isAvailable(worker),
            `isAvailable should be ${isAvailable}`
        ).to.be.equal(isAvailable);
        expect(
            await instance.isPending(worker),
            `isAvailable should be ${isPending}`
        ).to.be.equal(isPending);

        expect(
            await instance.isOwned(worker),
            `isOwned should be ${isOwned}`
        ).to.be.equal(isOwned);
        expect(
            await instance.isRetired(worker),
            `isRetired should be ${isRetired}`
        ).to.be.equal(isRetired);
    };

    it("initial state", async () => {
        const { worker } = await getNamedAccounts();
        await expectState(instanceUser, worker, true, false, false, false);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(state, "Worker should start Available").to.equal(
                "Available"
            );
        }
    });

    it("hire", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceUser.hire(worker),
            "hiring worker without sending ether should revert"
        ).to.be.revertedWith("funding below minimum");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state,
                "Worker should remain Available if hire doesn't send ether"
            ).to.equal("Available");
        }

        await expect(
            instanceUser.hire(worker, { value: ethers.utils.parseEther("15") }),
            "claiming worker while sending too much ether should revert"
        ).to.be.revertedWith("funding above maximum");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state,
                "Worker should remain Available if hire sends too much ether"
            ).to.equal("Available");
        }

        // Worker Address cannot be 0x00
        await expect(
            instanceUser.hire(NULL_ADDRESS, {
                value: ethers.utils.parseEther("1"),
            }),
            "transaction should revert if worker address is 0x0"
        ).to.be.revertedWith("worker address can not be 0x0");

        if (enableDelegate) {
            let falseInitialState = JSON.stringify({
                worker_address: NULL_ADDRESS,
                worker_manager_address: instanceWorker.address,
            });
            let state = JSON.parse(await getState(falseInitialState));

            expect(state, "Worker 0x0 cannot be hired").to.equal("Available");
        }

        // Hiring worker correctly should emit event
        await expect(
            instanceUser.hire(worker, {
                value: ethers.utils.parseEther("1"),
            }),
            "Hiring worker correctly should emit event"
        )
            .to.emit(instanceUser, "JobOffer")
            .withArgs(worker, user);

        // TODO: add change in balance check of [-1, 1]
        await expectState(instanceUser, worker, false, true, false, false);
        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user address"
        ).to.equal(user);

        expect(
            await instanceUser.getOwner(worker),
            "worker's owner only changes after it accepts the new user"
        ).to.equal(NULL_ADDRESS);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Pending.toUpperCase(),
                "Worker state should be Pending after successul hire"
            ).to.equal(user.toUpperCase());
        }
    });

    it("cancelHire", async () => {
        const { user, worker } = await getNamedAccounts();

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1"),
        });

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user"
        ).to.equal(user);
        await expectState(instanceUser, worker, false, true, false, false);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Pending.toUpperCase(),
                "Worker state should be Pending after successul hire"
            ).to.equal(user.toUpperCase());
        }

        await expect(
            instanceWorker.cancelHire(worker),
            "cancelHire should revert if msg.sender is not hirer"
        ).to.be.revertedWith("only hirer can cancel the offer");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Pending.toUpperCase(),
                "Worker state should remain Pending when cancelHire fails"
            ).to.equal(user.toUpperCase());
        }

        await expect(
            instanceUser.cancelHire(worker),
            "cancelHire worker correctly should emit event"
        )
            .to.emit(instanceUser, "JobRejected")
            .withArgs(worker, user);

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be the same, after hire was cancelled"
        ).to.equal(user);

        await expectState(instanceUser, worker, false, false, false, true);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Retired.toUpperCase(),
                "Worker state should become Retired after successful cancelHire"
            ).to.equal(user.toUpperCase());
        }
    });

    it("acceptJob", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceWorker.acceptJob(),
            "transaction should revert if worker calls acceptJob() without offer"
        ).to.be.revertedWith("worker not is not in pending state");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state,
                "Worker state should remain Available when acceptJob called without offer"
            ).to.equal("Available");
        }

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1"),
        });

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user"
        ).to.equal(user);

        expect(
            await instanceUser.getOwner(worker),
            "worker's owner only change after it accepts the new user"
        ).to.equal(NULL_ADDRESS);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Pending.toUpperCase(),
                "Worker state should be Pending after successul hire"
            ).to.equal(user.toUpperCase());
        }

        // worker accepts job
        await expect(
            instanceWorker.acceptJob(),
            "acceptJob() should emit event"
        )
            .to.emit(instanceWorker, "JobAccepted")
            .withArgs(worker, user);

        expect(
            await instanceUser.getOwner(worker),
            "boss should be boss address after the job is accepted"
        ).to.equal(user);

        await expectState(instanceUser, worker, false, false, true, false);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Owned.toUpperCase(),
                "Worker state should be Owned after the job is accepted"
            ).to.equal(user.toUpperCase());
        }
    });

    it("authorize", async () => {
        const { user, worker } = await getNamedAccounts();

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1"),
        });

        // worker accepts job
        await expect(
            instanceWorker.acceptJob(),
            "acceptJob() should emit event"
        )
            .to.emit(instanceWorker, "JobAccepted")
            .withArgs(worker, user);

        const dapp = "0xe5573Cf4703fe9c7b1abD9bcD0AB73fCfCeCb29C";
        expect(
            await instanceUser.isAuthorized(worker, dapp),
            "should not be authorized"
        ).to.be.false;

        await expect(instanceUser.authorize(worker, dapp), "authorize dapp")
            .to.emit(instanceUser, "Authorization")
            .withArgs(user, worker, dapp);

        expect(
            await instanceUser.isAuthorized(worker, dapp),
            "should be authorized"
        ).to.be.true;
    });

    it("rejectJob", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceWorker.rejectJob(),
            "rejectJob() should revert if there is no offer"
        ).to.be.revertedWith("worker does not have a job offer");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state,
                "Worker state should remain Available when rejectJob called without offer"
            ).to.equal("Available");
        }

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1"),
        });

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user"
        ).to.equal(user);

        expect(
            await instanceUser.getOwner(worker),
            "worker's user will only change after it accepts the new user"
        ).to.equal(NULL_ADDRESS);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Pending.toUpperCase(),
                "Worker state should be Pending after successul hire"
            ).to.equal(user.toUpperCase());
        }

        // worker rejects job, should trigger change in balance
        // TODO: fix to.changeBalances call
        //await expect(() => instanceWorker.rejectJob()).to.changeBalances([boss, worker], [1, -1])

        await instanceWorker.rejectJob();

        expect(
            await instanceUser.getUser(worker),
            "hirer should not be boss address after the job is rejected"
        ).to.not.equal(user);

        expect(
            await instanceUser.getOwner(worker),
            "boss should not be boss address after the job is rejected"
        ).to.not.equal(user);

        await expectState(instanceUser, worker, true, false, false, false);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state,
                "Worker state should become Available after successful rejectJob"
            ).to.equal("Available");
        }
    });

    it("retire", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceUser.retire(worker),
            "retire worker with not owned must revert"
        ).to.be.revertedWith("worker not owned");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state,
                "Worker state should remain Available when retire called without offer"
            ).to.equal("Available");
        }

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1"),
        });

        // Accepts job correctly
        await instanceWorker.acceptJob();

        await expect(
            instanceWorker.retire(worker),
            "retire worker when user does not own worker should revert"
        ).to.be.revertedWith("only owner can retire worker");

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Owned.toUpperCase(),
                "Worker should remain Owned if retired not called by owner"
            ).to.equal(user.toUpperCase());
        }

        await expect(
            instanceUser.retire(worker),
            "requesting termination should emit event"
        )
            .to.emit(instanceUser, "Retired")
            .withArgs(worker, user);

        await expectState(instanceUser, worker, false, false, false, true);

        if (enableDelegate) {
            let state = JSON.parse(await getState(initialState));

            expect(
                state.Retired.toUpperCase(),
                "Worker state should become Retired after successful retire"
            ).to.equal(user.toUpperCase());
        }
    });
});
