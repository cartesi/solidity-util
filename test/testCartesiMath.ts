import { describe } from "mocha";
import { assert, use } from "chai";
import { deployments, ethers } from "@nomiclabs/buidler";
import { solidity } from "ethereum-waffle";
import { CartesiMath } from "../src/types/CartesiMath";
import log2values from "./log2values.json";

use(solidity);

describe("CartesiMath", async () => {
    beforeEach(async () => {
        await deployments.fixture();
    });

    it("log2ApproxTimes1M should be a reasonable approximation of log2 * 1M", async () => {
        let max_error = 0;
        const address = await (await deployments.get("CartesiMath")).address;
        const instance = (
            await ethers.getContractFactory("CartesiMath")
        ).attach(address) as CartesiMath;

        // generate random numbers between our log range (1 .. 2**256)
        for (let i = 0; i < log2values.length; i++) {
            const value = log2values[i].value;
            const logApprox = await instance.log2ApproxTimes1M(value);

            const realLog = log2values[i].log * 1000000;
            let error;

            if (realLog != 0) {
                error = Math.abs((realLog - logApprox.toNumber()) / realLog);
            } else {
                error = Math.abs(realLog - logApprox.toNumber());
            }

            // keep track of maximum error
            max_error = Math.max(max_error, error);

            assert.isBelow(error, 0.05, "Error is bigger than 5%");
        }

    }).timeout(60000);
});
