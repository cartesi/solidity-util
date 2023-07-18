// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { expect } from "chai";
import { deployments, ethers } from "hardhat";

import { TestBitmask } from "../src/types/test/TestBitmask";
import { TestBitmask__factory } from "../src/types/factories/test/TestBitmask__factory";

describe("TestBitmask", async () => {
    let TestBitmask: TestBitmask;

    beforeEach(async () => {
        await deployments.fixture();

        const [user] = await ethers.getSigners();

        const BitmaskAddress = (await deployments.get("Bitmask")).address;
        const { deploy } = deployments;
        const { address } = await deploy("TestBitmask", {
            from: user.address,
            log: true,
            libraries: {
                ["Bitmask"]: BitmaskAddress,
            },
        });

        TestBitmask = TestBitmask__factory.connect(address, user);
    });

    it("setting and getting bits", async () => {
        const testBits = [
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
            510,
            511,
            512,
            513,
            0,
            1,
            254,
            255,
            256,
            257,
        ];
        for (const bit of testBits) {
            // bit should not be set by default
            expect(await TestBitmask.getBit(bit)).to.be.false;

            // set bit
            await TestBitmask.setBit(bit);
            expect(await TestBitmask.getBit(bit)).to.be.true;

            // unset bit
            await TestBitmask.unsetBit(bit);
            expect(await TestBitmask.getBit(bit)).to.be.false;
        }
    });
});
