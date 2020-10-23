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

import { WorkerManager } from "../src/types/WorkerManager";
import { WorkerManagerFactory } from "../src/types/WorkerManagerFactory";

use(solidity);

describe("WorkerManager", async () => {
    let instanceUser: WorkerManager;
    let instanceWorker: WorkerManager;

    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

    beforeEach(async () => {
        await deployments.fixture();

        const [user, worker] = await ethers.getSigners();

        const address = (await deployments.get("WorkerManagerImpl")).address;
        instanceUser = WorkerManagerFactory.connect(address, user);
        instanceWorker = WorkerManagerFactory.connect(address, worker);
    });

    const expectState = async (
        instance: WorkerManager,
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
    });

    it("hire", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceUser.hire(worker),
            "hiring worker without sending ether should revert"
        ).to.be.revertedWith("funding below minimum");

        await expect(
            instanceUser.hire(worker, { value: ethers.utils.parseEther("15") }),
            "claiming worker while sending too much ether should revert"
        ).to.be.revertedWith("funding above maximum");

        // Worker Address cannot be 0x00
        await expect(
            instanceUser.hire(NULL_ADDRESS, {
                value: ethers.utils.parseEther("1")
            }),
            "transaction should revert if worker address is 0x0"
        ).to.be.revertedWith("worker address can not be 0x0");

        // Hiring worker correctly should emit event
        await expect(
            instanceUser.hire(worker, {
                value: ethers.utils.parseEther("1")
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
    });

    it("cancelHire", async () => {
        const { user, worker } = await getNamedAccounts();

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1")
        });

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user"
        ).to.equal(user);
        await expectState(instanceUser, worker, false, true, false, false);

        await expect(
            instanceWorker.cancelHire(worker),
            "cancelHire should revert if msg.sender is not hirer"
        ).to.be.revertedWith("only hirer can cancel the offer");

        await instanceUser.cancelHire(worker);

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be the same, after hire was cancelled"
        ).to.equal(user);

        await expectState(instanceUser, worker, false, false, false, true);
    });

    it("acceptJob", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceWorker.acceptJob(),
            "transaction should revert if worker calls acceptJob() without offer"
        ).to.be.revertedWith("worker does not have a job offer");

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1")
        });

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user"
        ).to.equal(user);

        expect(
            await instanceUser.getOwner(worker),
            "worker's owner only change after it accepts the new user"
        ).to.equal(NULL_ADDRESS);

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
    });

    it("rejectJob", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceWorker.rejectJob(),
            "rejectJob() should revert if there is no offer"
        ).to.be.revertedWith("worker does not have a job offer");

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1")
        });

        expect(
            await instanceUser.getUser(worker),
            "worker's user should be user"
        ).to.equal(user);

        expect(
            await instanceUser.getOwner(worker),
            "worker's user will only change after it accepts the new user"
        ).to.equal(NULL_ADDRESS);

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
    });

    it("retire", async () => {
        const { user, worker } = await getNamedAccounts();

        await expect(
            instanceUser.retire(worker),
            "retire worker with not owned must revert"
        ).to.be.revertedWith("worker not owned");

        // Hire worker correctly
        await instanceUser.hire(worker, {
            value: ethers.utils.parseEther("1")
        });

        // Accepts job correctly
        await instanceWorker.acceptJob();

        await expect(
            instanceWorker.retire(worker),
            "retire worker when user does not own worker should revert"
        ).to.be.revertedWith("only owner can retire worker");

        await expect(
            instanceUser.retire(worker),
            "requesting termination should emit event"
        )
            .to.emit(instanceUser, "Retired")
            .withArgs(worker, user);

        await expectState(instanceUser, worker, false, false, false, true);
    });
});
