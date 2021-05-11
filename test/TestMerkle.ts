// Copyright 2021 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { expect, use } from "chai";
import { deployments, ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { TestMerkle } from "../src/types/TestMerkle";
import { TestMerkle__factory } from "../src/types/factories/TestMerkle__factory";
import { getEmptyTreeHash, computeMerkleRootHash } from "../src/util/merkle";

import { keccak256 } from "ethers/lib/utils";

use(solidity);

describe("TestMerkle", async () => {
    let TestMerkle: TestMerkle;
    let zeroMerkle = [
        "0x011b4d03dd8c01f1049143cf9c4c817e4b167f1d1b83e5c6f0f10d89ba1e7bce",
        "0x4d9470a821fbe90117ec357e30bad9305732fb19ddf54a07dd3e29f440619254",
        "0xae39ce8537aca75e2eff3e38c98011dfe934e700a0967732fc07b430dd656a23",
        "0x3fc9a15f5b4869c872f81087bb6104b7d63e6f9ab47f2c43f3535eae7172aa7f",
        "0x17d2dd614cddaa4d879276b11e0672c9560033d3e8453a1d045339d34ba601b9",
        "0xc37b8b13ca95166fb7af16988a70fcc90f38bf9126fd833da710a47fb37a55e6",
        "0x8e7a427fa943d9966b389f4f257173676090c6e95f43e2cb6d65f8758111e309",
        "0x30b0b9deb73e155c59740bacf14a6ff04b64bb8e201a506409c3fe381ca4ea90",
        "0xcd5deac729d0fdaccc441d09d7325f41586ba13c801b7eccae0f95d8f3933efe",
        "0xd8b96e5b7f6f459e9cb6a2f41bf276c7b85c10cd4662c04cbbb365434726c0a0",
        "0xc9695393027fb106a8153109ac516288a88b28a93817899460d6310b71cf1e61",
        "0x63e8806fa0d4b197a259e8c3ac28864268159d0ac85f8581ca28fa7d2c0c03eb",
        "0x91e3eee5ca7a3da2b3053c9770db73599fb149f620e3facef95e947c0ee860b7",
        "0x2122e31e4bbd2b7c783d79cc30f60c6238651da7f0726f767d22747264fdb046",
        "0xf7549f26cc70ed5e18baeb6c81bb0625cb95bb4019aeecd40774ee87ae29ec51",
        "0x7a71f6ee264c5d761379b3d7d617ca83677374b49d10aec50505ac087408ca89",
        "0x2b573c267a712a52e1d06421fe276a03efb1889f337201110fdc32a81f8e1524",
        "0x99af665835aabfdc6740c7e2c3791a31c3cdc9f5ab962f681b12fc092816a62f",
        "0x27d86025599a41233848702f0cfc0437b445682df51147a632a0a083d2d38b5e",
        "0x13e466a8935afff58bb533b3ef5d27fba63ee6b0fd9e67ff20af9d50deee3f8b",
        "0xf065ec220c1fd4ba57e341261d55997f85d66d32152526736872693d2b437a23",
        "0x3e2337b715f6ac9a6a272622fdc2d67fcfe1da3459f8dab4ed7e40a657a54c36",
        "0x766c5e8ac9a88b35b05c34747e6507f6b044ab66180dc76ac1a696de03189593",
        "0xfedc0d0dbbd855c8ead673544899b0960e4a5a7ca43b4ef90afe607de7698cae",
        "0xfdc242788f654b57a4fb32a71b335ef6ff9a4cc118b282b53bdd6d6192b7a82c",
        "0x3c5126b9c7e33c8e5a5ac9738b8bd31247fb7402054f97b573e8abb9faad219f",
        "0x4fd085aceaa7f542d787ee4196d365f3cc566e7bbcfbfd451230c48d804c017d",
        "0x21e2d8fa914e2559bb72bf0ab78c8ab92f00ef0d0d576eccdd486b64138a4172",
        "0x674857e543d1d5b639058dd908186597e366ad5f3d9c7ceaff44d04d1550b8d3",
        "0x3abc751df07437834ba5acb32328a396994aebb3c40f759c2d6d7a3cb5377e55",
        "0xd5d218ef5a296dda8ddc355f3f50c3d0b660a51dfa4d98a6a5a33564556cf83c",
        "0x1373a814641d6a1dcef97b883fee61bb84fe60a3409340217e629cc7e4dcc93b",
        "0x85d8820921ff5826148b60e6939acd7838e1d7f20562bff8ee4b5ec4a05ad997",
        "0xa57b9796fdcb2eda87883c2640b072b140b946bfdf6575cacc066fdae04f6951",
        "0xe63624cbd316a677cad529bbe4e97b9144e4bc06c4afd1de55dd3e1175f90423",
        "0x847a230d34dfb71ed56f2965a7f6c72e6aa33c24c303fd67745d632656c5ef90",
        "0xbec80f4f5d1daa251988826cef375c81c36bf457e09687056f924677cb0bccf9",
        "0x8dff81e014ce25f2d132497923e267363963cdf4302c5049d63131dc03fd95f6",
        "0x5d8b6aa5934f817252c028c90f56d413b9d5d10d89790707dae2fabb249f6499",
        "0x29927c21dd71e3f656826de5451c5da375aadecbd59d5ebf3a31fae65ac1b316",
        "0xa1611f1b276b26530f58d7247df459ce1f86db1d734f6f811932f042cee45d0e",
        "0x455306d01081bc3384f82c5fb2aacaa19d89cdfa46cc916eac61121475ba2e61",
        "0x91b4feecbe1789717021a158ace5d06744b40f551076b67cd63af60007f8c998",
        "0x76e1424883a45ec49d497ddaf808a5521ca74a999ab0b3c7aa9c80f85e93977e",
        "0xc61ce68b20307a1a81f71ca645b568fcd319ccbb5f651e87b707d37c39e15f94",
        "0x5ea69e2f7c7d2ccc85b7e654c07e96f0636ae4044fe0e38590b431795ad0f864",
        "0x7bdd613713ada493cc17efd313206380e6a685b8198475bbd021c6e9d94daab2",
        "0x214947127506073e44d5408ba166c512a0b86805d07f5a44d3c41706be2bc15e",
        "0x712e55805248b92e8677d90f6d284d1d6ffaff2c430657042a0e82624fa3717b",
        "0x06cc0a6fd12230ea586dae83019fb9e06034ed2803c98d554b93c9a52348caff",
        "0xf75c40174a91f9ae6b8647854a156029f0b88b83316663ce574a4978277bb6bb",
        "0x27a31085634b6ec78864b6d8201c7e93903d75815067e378289a3d072ae172da",
        "0xfa6a452470f8d645bebfad9779594fc0784bb764a22e3a8181d93db7bf97893c",
        "0x414217a618ccb14caa9e92e8c61673afc9583662e812adba1f87a9c68202d60e",
        "0x909efab43c42c0cb00695fc7f1ffe67c75ca894c3c51e1e5e731360199e600f6",
        "0xced9a87b2a6a87e70bf251bb5075ab222138288164b2eda727515ea7de12e249",
        "0x6d4fe42ea8d1a120c03cf9c50622c2afe4acb0dad98fd62d07ab4e828a94495f",
        "0x6d1ab973982c7ccbe6c1fae02788e4422ae22282fa49cbdb04ba54a7a238c6fc",
        "0x41187451383460762c06d1c8a72b9cd718866ad4b689e10c9a8c38fe5ef045bd",
        "0x785b01e980fc82c7e3532ce81876b778dd9f1ceeba4478e86411fb6fdd790683",
        "0x916ca832592485093644e8760cd7b4c01dba1ccc82b661bf13f0e3f34acd6b88",
        "0x7b3fbc4a995c19017816b74d2f89179f10b6681bcefd8cfec7d8e18d0f35dbc7",
    ];

    beforeEach(async () => {
        await deployments.fixture();
        const [user] = await ethers.getSigners();
        const address = (await deployments.get("Merkle")).address;

        TestMerkle = TestMerkle__factory.connect(address, user);
    });

    it("getPristineHash", async () => {
        await expect(
            TestMerkle.getPristineHash(2),
            "pristine hash should revert if log2size is <3"
        ).to.be.reverted;

        await expect(
            TestMerkle.getPristineHash(65),
            "pristine hash should revert if log2size is > 64"
        ).to.be.reverted;

        for (let i = 0; i < 61; i++) {
            var pristine = await TestMerkle.getPristineHash(i + 3);

            expect(pristine).to.be.equal(
                "0x" + getEmptyTreeHash(i).toString("hex")
            );
        }
    });

    it("getEmptyTreeHash", async () => {
        await expect(
            TestMerkle.getEmptyTreeHashAtIndex(64),
            "empty tree lookup beyond index should revert"
        ).to.be.reverted;

        for (let i = 0; i < zeroMerkle.length - 1; i++) {
            expect(await TestMerkle.getEmptyTreeHashAtIndex(i)).to.equal(
                zeroMerkle[i]
            );
        }
    });

    it("getMerkleRootFromBytes", async () => {
        // reverts
        await expect(
            TestMerkle.getMerkleRootFromBytes("0xaa", 2),
            "getMerkleRootFromBytes should revert is log2size < 3"
        ).to.be.reverted;

        await expect(
            TestMerkle.getMerkleRootFromBytes("0xaa", 65),
            "getMerkleRootFromBytes should revert is log2size > 64 "
        ).to.be.reverted;

        await expect(
            TestMerkle.getMerkleRootFromBytes(
                "0xaaaabbccddaabbccddabbccddaabbccddaabbccddaabbccddabbccddaabbccdd",
                3
            ),
            "getMerkleRootFromBytes should revert is data > drive"
        ).to.be.reverted;

        // empty data
        for (var i = 3; i < 64; i++) {
            expect(
                await TestMerkle.getMerkleRootFromBytes([], i),
                "empyt data should return pristine hash"
            ).to.equal(await TestMerkle.getPristineHash(i));
        }

        // different inputs
        var testcases = [
            "est95192",
            "est9519251e5q1w9",
            "est9519251e5q1w954sd984sdf5a1ste",
            "st9519251e5sdqsa1232524599541234",
            "est9519251e5q1w954sd984sdf5a1stest9519251e5sdqsa1232524599541234est9519251e5q1w954sd984sdf5a1stest9519251e5sdqsa1232524599541234est9519251e5q1w954sd984sdf5a1stest9519251e5sdqsa1232524599541234est9519251e5q1w954sd984sdf5a1stest9519251e5sdqsa1232524599541234",
        ];
        var log2Sizes = [8, 15, 30, 45, 63, 64];
        var smallLog2Sizes = [3, 4, 5, 7];

        for (var testcase of testcases) {
            for (var size of log2Sizes) {
                expect(
                    await TestMerkle.getMerkleRootFromBytes(
                        Buffer.from(testcase),
                        size
                    ),
                    `merkle root hash of testcase ${testcase} for size ${size} didn't match`
                ).to.equal(computeMerkleRootHash(Buffer.from(testcase), size));
            }
        }

        // test cases for small log2 sizes
        for (var size of smallLog2Sizes) {
            expect(
                await TestMerkle.getMerkleRootFromBytes(
                    Buffer.from(testcases[0]),
                    size
                ),
                `merkle root hash for small log2 size of ${size} didn't match`
            ).to.equal(computeMerkleRootHash(Buffer.from(testcases[0]), size));
        }
    });

    it("getHashOfWordAtIndex", async () => {
        var fullstring =
            "0x0000000000000000111111111111111122222222222222223333333333333333444444444444444455555555555555556666666666666666777777777777777788888888888888889999999999999999aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbccccccccccccccccddddddddddddddddcccc";

        var slice = [
            "0x0000000000000000",
            "0x1111111111111111",
            "0x2222222222222222",
            "0x3333333333333333",
            "0x4444444444444444",
            "0x5555555555555555",
            "0x6666666666666666",
            "0x7777777777777777",
            "0x8888888888888888",
            "0x9999999999999999",
            "0xaaaaaaaaaaaaaaaa",
            "0xbbbbbbbbbbbbbbbb",
            "0xcccccccccccccccc",
            "0xdddddddddddddddd",
            "0xcccc000000000000",
        ];
        for (var i = 0; i < slice.length; i++) {
            expect(
                await TestMerkle.getHashOfWordAtIndex(fullstring, i)
            ).to.equal(keccak256(slice[i]));
        }
        await expect(
            TestMerkle.getHashOfWordAtIndex(fullstring, fullstring.length + 1),
            "hash lookup after index should revert"
        ).to.be.reverted;
    });
});
