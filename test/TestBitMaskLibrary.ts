import { expect, use } from "chai";
import { deployments, ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { TestBitMaskLibrary } from "../src/types/TestBitMaskLibrary";
import { TestBitMaskLibrary__factory } from "../src/types/factories/TestBitMaskLibrary__factory";

use(solidity);

describe("TestBitMaskLibrary", async () => {
    let TestBitMaskLibrary: TestBitMaskLibrary;

    beforeEach(async () => {
        await deployments.fixture();

        const [user] = await ethers.getSigners();

        const address = (await deployments.get("TestBitMaskLibrary")).address;
        TestBitMaskLibrary = TestBitMaskLibrary__factory.connect(address, user);
    });

    it("setting and getting bits", async () => {
        const testBits = [0, 1, 254, 255, 256, 257, 510, 511, 512, 513]
        for (const bit of testBits) {
            // bit should not be set by default
            expect(await TestBitMaskLibrary.getBit(bit)).to.be.false;

            // set bit
            await TestBitMaskLibrary.setBit(bit);
            expect(await TestBitMaskLibrary.getBit(bit)).to.be.true;
        }
    });
});
