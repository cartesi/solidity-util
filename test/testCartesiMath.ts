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
import { assert, use } from "chai";
import { deployments, ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { CartesiMathFactory } from "../src/types/CartesiMathFactory";
import log2values from "./log2values.json";

use(solidity);

describe("CartesiMath", async () => {
    beforeEach(async () => {
        await deployments.fixture();
    });

    it("log2ApproxTimes1M should be a reasonable approximation of log2 * 1M", async () => {
        let max_error = 0;
        const address = (await deployments.get("CartesiMath")).address;
        const [signer] = await ethers.getSigners();
        const instance = CartesiMathFactory.connect(address, signer);

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
