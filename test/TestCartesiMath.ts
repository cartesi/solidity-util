// Copyright 2021 Cartesi Pte. Ltd.

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

import { TestCartesiMath } from "../src/types/test/TestCartesiMath";
import { TestCartesiMath__factory } from "../src/types/factories/test/TestCartesiMath__factory";

describe("TestCartesiMath", async () => {
    let TestCartesiMath: TestCartesiMath;

    beforeEach(async () => {
        await deployments.fixture();

        const [user] = await ethers.getSigners();
        0;
        const CartesiMathAddress = (await deployments.get("CartesiMath"))
            .address;
        const { deploy } = deployments;
        const { address } = await deploy("TestCartesiMath", {
            from: user.address,
            log: true,
            libraries: {
                ["CartesiMath"]: CartesiMathAddress,
            },
        });

        TestCartesiMath = TestCartesiMath__factory.connect(address, user);
    });

    it("getLog2TableTimes1M", async () => {
        let log2tableTimes1M = new Array<number>(129);
        log2tableTimes1M[1] = 0;
        log2tableTimes1M[2] = 1000000;
        log2tableTimes1M[3] = 1584962;
        log2tableTimes1M[4] = 2000000;
        log2tableTimes1M[5] = 2321928;
        log2tableTimes1M[6] = 2584962;
        log2tableTimes1M[7] = 2807354;
        log2tableTimes1M[8] = 3000000;
        log2tableTimes1M[9] = 3169925;
        log2tableTimes1M[10] = 3321928;
        log2tableTimes1M[11] = 3459431;
        log2tableTimes1M[12] = 3584962;
        log2tableTimes1M[13] = 3700439;
        log2tableTimes1M[14] = 3807354;
        log2tableTimes1M[15] = 3906890;
        log2tableTimes1M[16] = 4000000;
        log2tableTimes1M[17] = 4087462;
        log2tableTimes1M[18] = 4169925;
        log2tableTimes1M[19] = 4247927;
        log2tableTimes1M[20] = 4321928;
        log2tableTimes1M[21] = 4392317;
        log2tableTimes1M[22] = 4459431;
        log2tableTimes1M[23] = 4523561;
        log2tableTimes1M[24] = 4584962;
        log2tableTimes1M[25] = 4643856;
        log2tableTimes1M[26] = 4700439;
        log2tableTimes1M[27] = 4754887;
        log2tableTimes1M[28] = 4807354;
        log2tableTimes1M[29] = 4857980;
        log2tableTimes1M[30] = 4906890;
        log2tableTimes1M[31] = 4954196;
        log2tableTimes1M[32] = 5000000;
        log2tableTimes1M[33] = 5044394;
        log2tableTimes1M[34] = 5087462;
        log2tableTimes1M[35] = 5129283;
        log2tableTimes1M[36] = 5169925;
        log2tableTimes1M[37] = 5209453;
        log2tableTimes1M[38] = 5247927;
        log2tableTimes1M[39] = 5285402;
        log2tableTimes1M[40] = 5321928;
        log2tableTimes1M[41] = 5357552;
        log2tableTimes1M[42] = 5392317;
        log2tableTimes1M[43] = 5426264;
        log2tableTimes1M[44] = 5459431;
        log2tableTimes1M[45] = 5491853;
        log2tableTimes1M[46] = 5523561;
        log2tableTimes1M[47] = 5554588;
        log2tableTimes1M[48] = 5584962;
        log2tableTimes1M[49] = 5614709;
        log2tableTimes1M[50] = 5643856;
        log2tableTimes1M[51] = 5672425;
        log2tableTimes1M[52] = 5700439;
        log2tableTimes1M[53] = 5727920;
        log2tableTimes1M[54] = 5754887;
        log2tableTimes1M[55] = 5781359;
        log2tableTimes1M[56] = 5807354;
        log2tableTimes1M[57] = 5832890;
        log2tableTimes1M[58] = 5857980;
        log2tableTimes1M[59] = 5882643;
        log2tableTimes1M[60] = 5906890;
        log2tableTimes1M[61] = 5930737;
        log2tableTimes1M[62] = 5954196;
        log2tableTimes1M[63] = 5977279;
        log2tableTimes1M[64] = 6000000;
        log2tableTimes1M[65] = 6022367;
        log2tableTimes1M[66] = 6044394;
        log2tableTimes1M[67] = 6066089;
        log2tableTimes1M[68] = 6087462;
        log2tableTimes1M[69] = 6108524;
        log2tableTimes1M[70] = 6129283;
        log2tableTimes1M[71] = 6149747;
        log2tableTimes1M[72] = 6169925;
        log2tableTimes1M[73] = 6189824;
        log2tableTimes1M[74] = 6209453;
        log2tableTimes1M[75] = 6228818;
        log2tableTimes1M[76] = 6247927;
        log2tableTimes1M[77] = 6266786;
        log2tableTimes1M[78] = 6285402;
        log2tableTimes1M[79] = 6303780;
        log2tableTimes1M[80] = 6321928;
        log2tableTimes1M[81] = 6339850;
        log2tableTimes1M[82] = 6357552;
        log2tableTimes1M[83] = 6375039;
        log2tableTimes1M[84] = 6392317;
        log2tableTimes1M[85] = 6409390;
        log2tableTimes1M[86] = 6426264;
        log2tableTimes1M[87] = 6442943;
        log2tableTimes1M[88] = 6459431;
        log2tableTimes1M[89] = 6475733;
        log2tableTimes1M[90] = 6491853;
        log2tableTimes1M[91] = 6507794;
        log2tableTimes1M[92] = 6523561;
        log2tableTimes1M[93] = 6539158;
        log2tableTimes1M[94] = 6554588;
        log2tableTimes1M[95] = 6569855;
        log2tableTimes1M[96] = 6584962;
        log2tableTimes1M[97] = 6599912;
        log2tableTimes1M[98] = 6614709;
        log2tableTimes1M[99] = 6629356;
        log2tableTimes1M[100] = 6643856;
        log2tableTimes1M[101] = 6658211;
        log2tableTimes1M[102] = 6672425;
        log2tableTimes1M[103] = 6686500;
        log2tableTimes1M[104] = 6700439;
        log2tableTimes1M[105] = 6714245;
        log2tableTimes1M[106] = 6727920;
        log2tableTimes1M[107] = 6741466;
        log2tableTimes1M[108] = 6754887;
        log2tableTimes1M[109] = 6768184;
        log2tableTimes1M[110] = 6781359;
        log2tableTimes1M[111] = 6794415;
        log2tableTimes1M[112] = 6807354;
        log2tableTimes1M[113] = 6820178;
        log2tableTimes1M[114] = 6832890;
        log2tableTimes1M[115] = 6845490;
        log2tableTimes1M[116] = 6857980;
        log2tableTimes1M[117] = 6870364;
        log2tableTimes1M[118] = 6882643;
        log2tableTimes1M[119] = 6894817;
        log2tableTimes1M[120] = 6906890;
        log2tableTimes1M[121] = 6918863;
        log2tableTimes1M[122] = 6930737;
        log2tableTimes1M[123] = 6942514;
        log2tableTimes1M[124] = 6954196;
        log2tableTimes1M[125] = 6965784;
        log2tableTimes1M[126] = 6977279;
        log2tableTimes1M[127] = 6988684;
        log2tableTimes1M[128] = 7000000;

        for (let i = 1; i < 129; i++) {
            expect(await TestCartesiMath.getLog2TableTimes1M(i)).to.be.equal(
                log2tableTimes1M[i]
            );
        }
    });

    it("ctz", async () => {
        // TODO: Implement ctz function on typescript to calculate ctz of big number
        // so we don't have to have the second array
        var nums = [
            0,
            2,
            4,
            8,
            9,
            11,
            2 ** 8,
            110,
            2 ** 40,
            2 ** 50,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            "0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
            "0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0",
            "0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc",
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffff000000000000",
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00",
        ];
        var res = [256, 1, 2, 3, 0, 0, 8, 1, 40, 50, 0, 0, 0, 1, 4, 2, 48, 8];

        for (let i = 0; i < nums.length; i++) {
            expect(await TestCartesiMath.ctz(nums[i])).to.be.equal(res[i]);
        }
    });

    it("clz", async () => {
        // TODO: Implement clz function on typescript for big number
        // so we don't have to have the second array
        var nums = [
            0,
            1,
            2,
            4,
            8,
            9,
            11,
            2 ** 8,
            110,
            2 ** 40,
            2 ** 50,
            0xffff,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            "0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
            "0x0000000000000000000000000000ffffffffffffffffffffffff000000000000",
        ];
        var res = [
            256, 255, 254, 253, 252, 252, 252, 247, 249, 215, 205, 240, 16, 0,
            1, 112,
        ];

        for (let i = 0; i < nums.length; i++) {
            expect(await TestCartesiMath.clz(nums[i])).to.be.equal(res[i]);
        }
    });

    it("isPowerOf2", async () => {
        var nums = [1, 2, 4, 8, 9, 11, 2 ** 8, 110, 2 ** 40, 2 ** 50, 0xffff];

        var bignums = [
            0,
            "0x1000000000000000000000000000000000000000000000000000000000000000",
            "0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
            "0x1427247692705959881058285969449495136382746624",
            "0x0000100000000000000000000000000000000000000000000000000000000000",
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffff000000000000",
            "0x0000000000000000000000000000000000100000000000000000000000000000",
        ];
        var bigres = [false, true, false, false, true, false, true];

        for (let i = 0; i < nums.length; i++) {
            expect(await TestCartesiMath.isPowerOf2(nums[i])).to.be.equal(
                powerOf2(nums[i])
            );
        }
        for (let i = 0; i < bignums.length; i++) {
            expect(await TestCartesiMath.isPowerOf2(bignums[i])).to.be.equal(
                bigres[i]
            );
        }
    });

    it("getLog2Floor", async () => {
        await expect(
            TestCartesiMath.getLog2Floor(0),
            "log of zero should revert"
        ).to.be.revertedWith("log of zero is undefined");

        var nums = [1, 2, 4, 8, 9, 11, 2 ** 8, 110, 2 ** 40, 2 ** 50, 0xffff];

        var bignums = [
            "0x1000000000000000000000000000000000000000000000000000000000000000",
            "0x0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
            "0x1427247692705959881058285969449495136382746624",
            "0x0000100000000000000000000000000000000000000000000000000000000000",
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffff000000000000",
            "0x0000000000000000000000000000000000100000000000000000000000000000",
        ];

        var bigres = [252, 251, 180, 236, 254, 116];

        for (let i = 0; i < nums.length; i++) {
            expect(await TestCartesiMath.getLog2Floor(nums[i])).to.be.equal(
                log2F(nums[i])
            );
        }

        for (let i = 0; i < bignums.length; i++) {
            expect(await TestCartesiMath.getLog2Floor(bignums[i])).to.be.equal(
                bigres[i]
            );
        }
    });
});

function powerOf2(v: number) {
    return v && !(v & (v - 1));
}
function log2F(v: number) {
    return Math.floor(Math.log2(v));
}
