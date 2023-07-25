// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { expect } from "chai";
import { keccak256 } from "ethers";
import { deployments, ethers } from "hardhat";

import { TestMerkle } from "../src/types/test/TestMerkle";
import { TestMerkle__factory } from "../src/types/factories/test/TestMerkle__factory";
import {
    computeMerkleRootHash,
    computeMerkleRootHashFromHashes,
} from "../src/util/merkle";

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
        const address = (await deployments.get("MerkleV2")).address;

        TestMerkle = TestMerkle__factory.connect(address, user);
    });

    // This function `getPristineHash` is deprecated
    // it("getPristineHash", async () => {
    //     await expect(
    //         TestMerkle.getPristineHash(2),
    //         "pristine hash should revert if log2size is <3"
    //     ).to.be.reverted;

    //     await expect(
    //         TestMerkle.getPristineHash(65),
    //         "pristine hash should revert if log2size is > 64"
    //     ).to.be.reverted;

    //     for (let i = 0; i < 61; i++) {
    //         var pristine = await TestMerkle.getPristineHash(i + 3);

    //         expect(pristine).to.be.equal(
    //             "0x" + getEmptyTreeHash(i).toString("hex")
    //         );
    //     }
    // });

    it("getEmptyTreeHash", async () => {
        await expect(
            TestMerkle.getEmptyTreeHashAtIndex(64),
            "empty tree lookup beyond index should revert",
        ).to.be.reverted;

        for (let i = 0; i < zeroMerkle.length - 1; i++) {
            expect(await TestMerkle.getEmptyTreeHashAtIndex(i)).to.equal(
                zeroMerkle[i],
            );
        }
    });

    it("getMerkleRootFromBytes", async () => {
        // reverts
        await expect(
            TestMerkle.getMerkleRootFromBytes("0xaa", 2),
            "getMerkleRootFromBytes should revert is log2size < 3",
        ).to.be.reverted;

        await expect(
            TestMerkle.getMerkleRootFromBytes("0xaa", 65),
            "getMerkleRootFromBytes should revert is log2size > 64 ",
        ).to.be.reverted;

        await expect(
            TestMerkle.getMerkleRootFromBytes(
                "0xaaaabbccddaabbccddabbccddaabbccddaabbccddaabbccddabbccddaabbccdd",
                3,
            ),
            "getMerkleRootFromBytes should revert is data > drive",
        ).to.be.reverted;

        // empty data
        for (var i = 3; i < 64; i++) {
            expect(
                await TestMerkle.getMerkleRootFromBytes(new Uint8Array(), i),
                "empyt data should return pristine hash",
            ).to.equal(zeroMerkle[i - 3]);
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
                        size,
                    ),
                    `merkle root hash of testcase ${testcase} for size ${size} didn't match`,
                ).to.equal(computeMerkleRootHash(Buffer.from(testcase), size));
            }
        }

        // test cases for small log2 sizes
        for (var size of smallLog2Sizes) {
            expect(
                await TestMerkle.getMerkleRootFromBytes(
                    Buffer.from(testcases[0]),
                    size,
                ),
                `merkle root hash for small log2 size of ${size} didn't match`,
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
                await TestMerkle.getHashOfWordAtIndex(fullstring, i),
            ).to.equal(keccak256(slice[i]));
        }
        await expect(
            TestMerkle.getHashOfWordAtIndex(fullstring, fullstring.length + 1),
            "hash lookup after index should revert",
        ).to.be.reverted;
    });

    it("getRootAfterReplacementInDrive", async () => {
        // simulate test cases in OutputImpl.ts
        // *** test case 1 ***
        let position = 0;
        let logSizeOfReplacement = 5;
        let logSizeOfFullDrive = 21;
        // the value of replacement should be '0x8753642e49d77fee978f980a21debd480e8243a4b5f5732ac7bd07b851911847' calculated from keccak
        let replacement = await TestMerkle.getMerkleRootFromBytes(
            "0x506fd6f6d63fb8676828b1a34518656754450a35c72cfcbc1d5514d954a3aea9",
            logSizeOfReplacement,
        );
        // siblings from bottom up
        let siblings = [
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
        ];

        expect(
            await TestMerkle.getRootAfterReplacementInDrive(
                position,
                logSizeOfReplacement,
                logSizeOfFullDrive,
                replacement,
                siblings,
            ),
            "test case 1",
        ).to.equal(
            "0x4d5d7f017cfb39a10b02e8800db1380d507fefc25b9efbfcfb81149eeff417a9",
        );

        // *** test case 2 ***
        position = 1 << logSizeOfReplacement; // index 1
        logSizeOfFullDrive = 37;
        replacement = keccak256(
            "0x4d5d7f017cfb39a10b02e8800db1380d507fefc25b9efbfcfb81149eeff417a9",
        );
        siblings = [
            "0xf887dff6c734c5faf153d9788f64b984b92da62147d64fcd219a7862c9e3144f",
            "0x633dc4d7da7256660a892f8f1604a44b5432649cc8ec5cb3ced4c4e6ac94dd1d",
            "0x890740a8eb06ce9be422cb8da5cdafc2b58c0a5e24036c578de2a433c828ff7d",
            "0x3b8ec09e026fdc305365dfc94e189a81b38c7597b3d941c279f042e8206e0bd8",
            "0xecd50eee38e386bd62be9bedb990706951b65fe053bd9d8a521af753d139e2da",
            "0xdefff6d330bb5403f63b14f33b578274160de3a50df4efecf0e0db73bcdd3da5",
            "0x617bdd11f7c0a11f49db22f629387a12da7596f9d1704d7465177c63d88ec7d7",
            "0x292c23a9aa1d8bea7e2435e555a4a60e379a5a35f3f452bae60121073fb6eead",
            "0xe1cea92ed99acdcb045a6726b2f87107e8a61620a232cf4d7d5b5766b3952e10",
            "0x7ad66c0a68c72cb89e4fb4303841966e4062a76ab97451e3b9fb526a5ceb7f82",
            "0xe026cc5a4aed3c22a58cbd3d2ac754c9352c5436f638042dca99034e83636516",
            "0x3d04cffd8b46a874edf5cfae63077de85f849a660426697b06a829c70dd1409c",
            "0xad676aa337a485e4728a0b240d92b3ef7b3c372d06d189322bfd5f61f1e7203e",
            "0xa2fca4a49658f9fab7aa63289c91b7c7b6c832a6d0e69334ff5b0a3483d09dab",
            "0x4ebfd9cd7bca2505f7bef59cc1c12ecc708fff26ae4af19abe852afe9e20c862",
            "0x2def10d13dd169f550f578bda343d9717a138562e0093b380a1120789d53cf10",
            "0x776a31db34a1a0a7caaf862cffdfff1789297ffadc380bd3d39281d340abd3ad",
            "0xe2e7610b87a5fdf3a72ebe271287d923ab990eefac64b6e59d79f8b7e08c46e3",
            "0x504364a5c6858bf98fff714ab5be9de19ed31a976860efbd0e772a2efe23e2e0",
            "0x4f05f4acb83f5b65168d9fef89d56d4d77b8944015e6b1eed81b0238e2d0dba3",
            "0x44a6d974c75b07423e1d6d33f481916fdd45830aea11b6347e700cd8b9f0767c",
            "0xedf260291f734ddac396a956127dde4c34c0cfb8d8052f88ac139658ccf2d507",
            "0x6075c657a105351e7f0fce53bc320113324a522e8fd52dc878c762551e01a46e",
            "0x6ca6a3f763a9395f7da16014725ca7ee17e4815c0ff8119bf33f273dee11833b",
            "0x1c25ef10ffeb3c7d08aa707d17286e0b0d3cbcb50f1bd3b6523b63ba3b52dd0f",
            "0xfffc43bd08273ccf135fd3cacbeef055418e09eb728d727c4d5d5c556cdea7e3",
            "0xc5ab8111456b1f28f3c7a0a604b4553ce905cb019c463ee159137af83c350b22",
            "0x0ff273fcbf4ae0f2bd88d6cf319ff4004f8d7dca70d4ced4e74d2c74139739e6",
            "0x7fa06ba11241ddd5efdc65d4e39c9f6991b74fd4b81b62230808216c876f827c",
            "0x7e275adf313a996c7e2950cac67caba02a5ff925ebf9906b58949f3e77aec5b9",
            "0x8f6162fa308d2b3a15dc33cffac85f13ab349173121645aedf00f471663108be",
            "0x78ccaaab73373552f207a63599de54d7d8d0c1805f86ce7da15818d09f4cff62",
        ];

        expect(
            await TestMerkle.getRootAfterReplacementInDrive(
                position,
                logSizeOfReplacement,
                logSizeOfFullDrive,
                replacement,
                siblings,
            ),
            "test case 2",
        ).to.equal(
            "0x29a43b498006128f0fd6026242662f4a6f47412f027954cd3973e3419e531adf",
        );

        // *** test exceptions ***
        await expect(
            TestMerkle.getRootAfterReplacementInDrive(
                position,
                logSizeOfFullDrive + 1,
                logSizeOfFullDrive,
                replacement,
                siblings,
            ),
        ).to.be.reverted;
        // ).to.be.revertedWith(
        //     "Replacement bigger than original drive"
        // );

        await expect(
            TestMerkle.getRootAfterReplacementInDrive(
                position,
                2,
                logSizeOfFullDrive,
                replacement,
                siblings,
            ),
        ).to.be.reverted;
        // ).to.be.revertedWith(
        //     "Replacement must be at least one word"
        // );

        siblings = [
            "0xf887dff6c734c5faf153d9788f64b984b92da62147d64fcd219a7862c9e3144f",
        ];
        await expect(
            TestMerkle.getRootAfterReplacementInDrive(
                position,
                logSizeOfReplacement,
                65,
                replacement,
                siblings,
            ),
        ).to.be.reverted;
        // ).to.be.revertedWith(
        //     "Full drive can't be bigger than the machine itself"
        // );

        await expect(
            TestMerkle.getRootAfterReplacementInDrive(
                position + 1,
                logSizeOfReplacement,
                logSizeOfFullDrive,
                replacement,
                siblings,
            ),
        ).to.be.reverted;
        // ).to.be.revertedWith(
        //     "Position is not aligned"
        // );

        await expect(
            TestMerkle.getRootAfterReplacementInDrive(
                position,
                logSizeOfReplacement,
                logSizeOfFullDrive,
                replacement,
                siblings,
            ),
        ).to.be.reverted;
        // ).to.be.revertedWith(
        //     "Position is not aligned"
        // );
    });

    it("calculateRootFromPowerOfTwo", async () => {
        // *** test case 1 ***
        let power2hashes = [
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
        ];
        let bufferHashes = [];
        for (let i = 0; i < power2hashes.length; i++) {
            bufferHashes.push(
                Buffer.from(power2hashes[i].substr(2, 64), "hex"),
            );
        }
        expect(
            await TestMerkle.calculateRootFromPowerOfTwo(power2hashes),
            "test case 1",
        ).to.equal(
            `0x${computeMerkleRootHashFromHashes(
                bufferHashes,
                0,
                Math.log2(power2hashes.length),
            ).toString("hex")}`,
        );

        // *** test case 2 ***
        power2hashes = [
            "0xf887dff6c734c5faf153d9788f64b984b92da62147d64fcd219a7862c9e3144f",
            "0x633dc4d7da7256660a892f8f1604a44b5432649cc8ec5cb3ced4c4e6ac94dd1d",
            "0x890740a8eb06ce9be422cb8da5cdafc2b58c0a5e24036c578de2a433c828ff7d",
            "0x3b8ec09e026fdc305365dfc94e189a81b38c7597b3d941c279f042e8206e0bd8",
            "0xecd50eee38e386bd62be9bedb990706951b65fe053bd9d8a521af753d139e2da",
            "0xdefff6d330bb5403f63b14f33b578274160de3a50df4efecf0e0db73bcdd3da5",
            "0x617bdd11f7c0a11f49db22f629387a12da7596f9d1704d7465177c63d88ec7d7",
            "0x292c23a9aa1d8bea7e2435e555a4a60e379a5a35f3f452bae60121073fb6eead",
            "0xe1cea92ed99acdcb045a6726b2f87107e8a61620a232cf4d7d5b5766b3952e10",
            "0x7ad66c0a68c72cb89e4fb4303841966e4062a76ab97451e3b9fb526a5ceb7f82",
            "0xe026cc5a4aed3c22a58cbd3d2ac754c9352c5436f638042dca99034e83636516",
            "0x3d04cffd8b46a874edf5cfae63077de85f849a660426697b06a829c70dd1409c",
            "0xad676aa337a485e4728a0b240d92b3ef7b3c372d06d189322bfd5f61f1e7203e",
            "0xa2fca4a49658f9fab7aa63289c91b7c7b6c832a6d0e69334ff5b0a3483d09dab",
            "0x4ebfd9cd7bca2505f7bef59cc1c12ecc708fff26ae4af19abe852afe9e20c862",
            "0x2def10d13dd169f550f578bda343d9717a138562e0093b380a1120789d53cf10",
            "0x776a31db34a1a0a7caaf862cffdfff1789297ffadc380bd3d39281d340abd3ad",
            "0xe2e7610b87a5fdf3a72ebe271287d923ab990eefac64b6e59d79f8b7e08c46e3",
            "0x504364a5c6858bf98fff714ab5be9de19ed31a976860efbd0e772a2efe23e2e0",
            "0x4f05f4acb83f5b65168d9fef89d56d4d77b8944015e6b1eed81b0238e2d0dba3",
            "0x44a6d974c75b07423e1d6d33f481916fdd45830aea11b6347e700cd8b9f0767c",
            "0xedf260291f734ddac396a956127dde4c34c0cfb8d8052f88ac139658ccf2d507",
            "0x6075c657a105351e7f0fce53bc320113324a522e8fd52dc878c762551e01a46e",
            "0x6ca6a3f763a9395f7da16014725ca7ee17e4815c0ff8119bf33f273dee11833b",
            "0x1c25ef10ffeb3c7d08aa707d17286e0b0d3cbcb50f1bd3b6523b63ba3b52dd0f",
            "0xfffc43bd08273ccf135fd3cacbeef055418e09eb728d727c4d5d5c556cdea7e3",
            "0xc5ab8111456b1f28f3c7a0a604b4553ce905cb019c463ee159137af83c350b22",
            "0x0ff273fcbf4ae0f2bd88d6cf319ff4004f8d7dca70d4ced4e74d2c74139739e6",
            "0x7fa06ba11241ddd5efdc65d4e39c9f6991b74fd4b81b62230808216c876f827c",
            "0x7e275adf313a996c7e2950cac67caba02a5ff925ebf9906b58949f3e77aec5b9",
            "0x8f6162fa308d2b3a15dc33cffac85f13ab349173121645aedf00f471663108be",
            "0x78ccaaab73373552f207a63599de54d7d8d0c1805f86ce7da15818d09f4cff62",
        ];
        bufferHashes = [];
        for (let i = 0; i < power2hashes.length; i++) {
            bufferHashes.push(
                Buffer.from(power2hashes[i].substr(2, 64), "hex"),
            );
        }
        expect(
            await TestMerkle.calculateRootFromPowerOfTwo(power2hashes),
            "test case 2",
        ).to.equal(
            `0x${computeMerkleRootHashFromHashes(
                bufferHashes,
                0,
                Math.log2(power2hashes.length),
            ).toString("hex")}`,
        );

        // *** test case 3 ***
        power2hashes = [
            "0xf887dff6c734c5faf153d9788f64b984b92da62147d64fcd219a7862c9e3144f",
        ];
        bufferHashes = [];
        bufferHashes.push(Buffer.from(power2hashes[0].substr(2, 64), "hex"));
        expect(
            await TestMerkle.calculateRootFromPowerOfTwo(power2hashes),
            "test case 3",
        ).to.equal(
            `0x${computeMerkleRootHashFromHashes(bufferHashes, 0, 0).toString(
                "hex",
            )}`,
        );

        // *** test exceptions ***
        power2hashes = [
            "0xf887dff6c734c5faf153d9788f64b984b92da62147d64fcd219a7862c9e3144f",
            "0x633dc4d7da7256660a892f8f1604a44b5432649cc8ec5cb3ced4c4e6ac94dd1d",
            "0x890740a8eb06ce9be422cb8da5cdafc2b58c0a5e24036c578de2a433c828ff7d",
        ];
        bufferHashes = [];
        for (let i = 0; i < power2hashes.length; i++) {
            bufferHashes.push(
                Buffer.from(power2hashes[i].substr(2, 64), "hex"),
            );
        }
        await expect(
            TestMerkle.calculateRootFromPowerOfTwo(power2hashes),
            "not power of 2",
        ).to.be.reverted;
    });
});
