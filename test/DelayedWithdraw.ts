import { assert, expect, use } from "chai";
import {
    deployments,
    ethers,
    getNamedAccounts,
    getChainId,
} from "@nomiclabs/buidler";
import {
    deployMockContract,
    MockContract,
} from "@ethereum-waffle/mock-contract";
import { solidity } from "ethereum-waffle";

import { DelayedWithdraw } from "../src/types/DelayedWithdraw";
import { Signer } from "ethers";
import { splitSignature } from "ethers/lib/utils";

const { advanceTime } = require("./utils");

const ctsiJSON = require("../artifacts/IERC20.json");

use(solidity);

describe("DelayedWithdraw", async () => {
    const DAY = 86400; // seconds in a day
    const DELAY = 7 * DAY + 1;

    let signer: Signer;
    let alice: Signer;

    let aliceAddress: string;

    let delayed_withdraw: DelayedWithdraw;
    let mockToken: MockContract;

    const deployDelayedWithdraw = async ({
        ctsi,
    }: {
        ctsi?: string;
    } = {}): Promise<DelayedWithdraw> => {
        const network_id = await getChainId();
        const ctsiAddress = ctsi || ctsiJSON.networks[network_id].address;
        const delayedFactory = await ethers.getContractFactory("DelayedWithdraw");
        const delayed_withdraw = await delayedFactory.deploy(ctsiAddress);

        await delayed_withdraw.deployed();
        return delayed_withdraw as DelayedWithdraw;
    };

    beforeEach(async () => {
        //await deployments.fixture();

        [signer, alice] = await ethers.getSigners();
        aliceAddress = await alice.getAddress();
        mockToken = await deployMockContract(signer, ctsiJSON.abi);

        delayed_withdraw = await deployDelayedWithdraw ({ ctsi: mockToken.address });
    });

    it("Get withdrawal amount should be zero if there are no withdrawals", async () => {
         expect(
            await delayed_withdraw.getWithdrawalAmount(),
            "Amount should be zero when there are no withdrawals"
        ).to.equal(0);
    });

    it("Request Withdrawal should revert if contract has no balance", async () => {

        await mockToken.mock.balanceOf.returns(0);

        await expect(
            delayed_withdraw.requestWithdrawal(aliceAddress, 50),
            "Contract doesnt have enough balance"
        ).to.be.revertedWith("Not enough tokens in the contract for this Withdrawal request");
    });

    it("Request Withdrawal should revert if withdraw amount is zero", async () => {
        await expect(
            delayed_withdraw.requestWithdrawal(aliceAddress, 0),
            "Amount cant be zero for a withdraw request"
        ).to.be.revertedWith("withdrawal amount has to be bigger than 0");
    });

    it("Request Withdrawal should set receiver, amount and timestamp correctly", async () => {
        let _amount = 50;
        await mockToken.mock.balanceOf.returns(_amount);

        await expect(
            delayed_withdraw.requestWithdrawal(aliceAddress, _amount),
            "Finalizing withdraw should emit event"
        )
            .to.emit(delayed_withdraw, "WithdrawRequested")

        expect(
            await delayed_withdraw.getWithdrawalAmount(),
            "withdraw amount has to be equal "
        ).to.equal(_amount);

        expect(
            await delayed_withdraw.getWithdrawalReceiver(),
            "receiver has to be set correctly"
        ).to.equal(aliceAddress);

        await mockToken.mock.balanceOf.returns(_amount * 2);

        // add more to withdraw
        await delayed_withdraw.requestWithdrawal(aliceAddress, _amount);
        expect(
            await delayed_withdraw.getWithdrawalAmount(),
            "withdraw amount should be amount * 2"
        ).to.equal(_amount * 2);
    });

    it("Withdrawal can only be finalized after delay", async () => {
        let _amount = 50;

        await mockToken.mock.balanceOf.returns(_amount);
        await delayed_withdraw.requestWithdrawal(aliceAddress, _amount);
        await expect(
            delayed_withdraw.finalizeWithdraw(),
            "Withdraw is not long enough"
        ).to.be.revertedWith("Withdrawal is not old enough to be finalized");

        await advanceTime(signer.provider, DELAY);

        await mockToken.mock.transfer.returns(true);

        await expect(
            delayed_withdraw.finalizeWithdraw(),
            "Finalizing withdraw should emit event"
        )
            .to.emit(delayed_withdraw, "WithdrawFinalized")
            .withArgs(aliceAddress, _amount);

        expect(
            await delayed_withdraw.getWithdrawalAmount(),
            "Amount should be zero after sucessfully finalized"
        ).to.equal(0);

    });

    it("Cancel withdrawal can only be called if there is an active withdrawal request", async () => {
        await expect(
            delayed_withdraw.cancelWithdrawal(),
            "Amount cant be zero for a withdraw request"
        ).to.be.revertedWith("There are no active withdrawal requests");
    });

    it("Withadrawal.amount should be 0 after cancel withdrawal", async () => {
        let _amount = 50;
        await mockToken.mock.balanceOf.returns(_amount);
        await delayed_withdraw.requestWithdrawal(aliceAddress, _amount);
        await expect(
            delayed_withdraw.cancelWithdrawal(),
            "Canceling withdrawal should emit event"
        )
            .to.emit(delayed_withdraw, "WithdrawCanceled")

        expect(
            await delayed_withdraw.getWithdrawalAmount(),
            "Amount should be zero after cancelWithdrawal()"
        ).to.equal(0);
    });

    it("Withdrawal functions can only be called by the owner", async () => {
        const [signer, alice] = await ethers.getSigners();

        const delayed_address = delayed_withdraw.address;
        let notOwner = delayed_withdraw.connect(alice);

        await expect(
            notOwner.requestWithdrawal(aliceAddress, 50),
            "Only owner can request Withdrawal"
        ).to.be.revertedWith("Ownable: caller is not the owner");

        await expect(
            notOwner.finalizeWithdraw(),
            "Only owner can finalize Withdrawal"
        ).to.be.revertedWith("Ownable: caller is not the owner");

        await expect(
            notOwner.cancelWithdrawal(),
            "Only owner can cancel Withdrawal"
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
