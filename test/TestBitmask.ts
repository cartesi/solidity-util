import { expect, use } from "chai";
import { deployments, ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { TestBitmask } from "../src/types/TestBitmask";
import { TestBitmask__factory } from "../src/types/factories/TestBitmask__factory";

use(solidity);

describe("TestBitmask", async () => {
    let TestBitmask: TestBitmask;

    beforeEach(async () => {
        await deployments.fixture();

        const [user] = await ethers.getSigners();

        const BitmaskAddress = (await deployments.get("Bitmask"))
            .address;
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
        const testBits = [510, 511, 512, 513, 0, 1, 254, 255, 256, 257]
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
