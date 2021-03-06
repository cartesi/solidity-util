import { expect, use } from "chai";
import { deployments, ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { TestBitmaskLibrary } from "../src/types/TestBitmaskLibrary";
import { TestBitmaskLibrary__factory } from "../src/types/factories/TestBitmaskLibrary__factory";

use(solidity);

describe("TestBitmaskLibrary", async () => {
    let TestBitmaskLibrary: TestBitmaskLibrary;

    beforeEach(async () => {
        await deployments.fixture();

        const [user] = await ethers.getSigners();

        const BitmaskLibraryAddress = (await deployments.get("BitmaskLibrary"))
            .address;
        const { deploy } = deployments;
        const { address } = await deploy("TestBitmaskLibrary", {
            from: user.address,
            log: true,
            libraries: {
                ["BitmaskLibrary"]: BitmaskLibraryAddress,
            },
        });

        TestBitmaskLibrary = TestBitmaskLibrary__factory.connect(address, user);
    });

    it("setting and getting bits", async () => {
        const testBits = [510, 511, 512, 513, 0, 1, 254, 255, 256, 257]
        for (const bit of testBits) {
            // bit should not be set by default
            expect(await TestBitmaskLibrary.getBit(bit)).to.be.false;

            // set bit
            await TestBitmaskLibrary.setBit(bit);
            expect(await TestBitmaskLibrary.getBit(bit)).to.be.true;

            // unset bit
            await TestBitmaskLibrary.unsetBit(bit);
            expect(await TestBitmaskLibrary.getBit(bit)).to.be.false;
        }
    });
});
