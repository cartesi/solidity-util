// Copyright 2020 Cartesi Pte. Ltd.

// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

/// @title Library for Merkle proofs
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./CartesiMath.sol";

library Merkle {
    using CartesiMath for uint256;
    using SafeMath for uint256;

    uint256 constant L_WORD_SIZE = 3; // word = 8 bytes, log = 3

    // TODO: check tree hashes hashes
    bytes constant EMPTY_TREE_HASHES =
        hex"48dda5bbe9171a6656206ec56c595c5834b6cf38c5fe71bcb44fe43833aee9dfb26375d755c9ce8078c93094de9e102afed549150c8480d6df6cb472738e3cd0a43010bca0bc7da9ae40fbe15b328ee4ff142eb684cb43bb28cd0518011e67eef33a0f9c869493f36bf1720052b742ef32889e84d72ef2bc91bb8c0485a0993b132f53a30f76f4ad11ee696a9f98411cc1bafe82b88b2eb174bef6a8883521b8c8eefb17a97220c58f18211c55e8ee4743231ee73ec39f9bd36b7f50be6dca68ba52706c0d6788b770279d311aa93ddd003936e49f1e55b4a9f3384349f15229c3d3e0ddc3c0dd0b933130b0bf7bdda32e614800524598f5d9cb5fa5c462162388c27232e6c4080106f92446b5e153eafbe25a182b258e9516f47889c54de9a5ff6b618042efa6d5854519219a4ebbed056f3ff71f1e122110368b2bfe68cfccbe68265b60dd86af9bae3c2a6b9a8f368ac30bd6f963e26465839c10ab9d5fa62979e26a20960d864b50bcf974ebddd2b11f8e9c6f9303ecf6e873095c21e1996563aed996725c54081c3d28dd1a4f6659ca74aaf01fc01d02776fa35b177004249dc37eb8f82e169a2d87d10b12cf68161dec7ba06351cad41e8f4ac253c32639266bdb4a6b5cd90d36121aed7e460148026fee17cc4fab04bbb176e1c7a3b7589d7fbb6454e79818e2d93dee4142f35c3f1d5d4d953292f3eb7f77a218489295a70f6d733e6705d0c55cb4a75a45dd406aeb6009d43e9813e697258ba19797ba75e1208e8dfe4e70a27ad5909b3fec2b74060b904feee750a2c5eca82dcaec81fee6a18857a7b887d2f9e10196d8e3e683b5e5dcbd0e2e801c16c5768ace8a19851ddc45db69e9c7ce8a8e727aef57086fee7a3ce7237631d645017030a472eb3639dfa7619385d62480529b24cd86cfd11b3f45028d1f44bca90c2b499b004f21a925a39ea6f433c621282ba99495bc3514b255adc5240527ac77445fe8d565664adf8716a0ec6ece10b95b86f8a9dc0997a2a51aa63eca154f4bfce1b08190a5ec49d1a15c559a35f810578aed875bd7710a3555bd90b90e415d78565a3503f0560480f02e0a8b11bf8feb2caefa345f5ad8f5ba0b6a785745ff29ad1cbe8936964b9d0bc9b6de970107e8ff9bd5dc2eb93ac5b70d9f3e479ada351013bf19281341306b86c2096489da274842ef4538f7c1a57e5f0ee9f2188b74dbf8ac68f2c01b86b5b2b1417631e652323ddf9a975aa3fe47cf91269c30b4439ea37a9780a9efb835e576e429e83d246e22bab4a9d7853b690088243282a0ff4b121d5801ca00bd33b4ff62ee04b9a41970d649faecc11cbfdf23f5be4f3d38844a52f285c24028ad218010fb386d4057b8d8a835976c491a78ce604919665daec74b892d214f225da5f25c70776c072cd353d9b7a7e2a7723cb683dc0fb40eaa08e350edd6b98a175f09171d61935fc52ee1ada2f72904870cf02a5c74dc92481d6ec8800f39082242470c0fd785ef62a9936b35ad5ddc64b1b04d0d6b65df50770607410c6f70bc86ab56c84c7335c2a9423d61ef9648a79bf114762e6d4bf5a866436cce7aa1a5e8a6f0b3fd52deb429c9e369d252d9bbda7a3d7eb33a55051731aacf97423cc7776d3af52fa386b0023fec2ab2134464914833289726422e07b85fa9aabcabe47f2a1e4907ee45082bf4fb295a362cb42697e5e9fe268b805b0d08a828dc98119dbf107b853f534e9beac1d5cbb7b70ba2f63f1026823e57df91e9910687c70042b527ea378c049fc37060749c22d649210b10ec24de4d56fb95810f899d2c2c017a6cce9732a039d370561113c919be35253446cfae45f22628e37d568eec308c9b7e5e4a9f13989200e3045933491e1ee90e680798832b379505847c48f8c5df0f896786fccd78822762316cda4f9b0048bca4573825873ec28845780108adf7960fa04924afd8a8c2ebacbf8756142f20006ebf909272432d33b06f5b84b23ebd8dede31c98c4f476670e2c5b50fce968a3745d3fc5fdc81744c662bb08be4c5ec58a4ce59f12c1cee4b3a34e7d3c9f98ef13ab39e5d90df1d71eed6dc72795ce5cf6238d7c17db63fd6551c3c087eeb933829f77b0e4ca7b583bd122059cb33457aac6644b619d44501474dee7696960acd6e1032cb8a22add6feb6478ccced393100c09d95f15d93a1d68161d5becb87b36ea92c5e4fba10cc39162168e953b504a0dc2d441ef5bbe12b66736e629f8c3503d7f4cc8c0cfb1570fcc5b2596f0fd05c55dbe8c66f8f4595efb966d931fb26fb1bfead47910a7eebfa762d0f4fd6b9ecb6d315fc9000f24e3da0be8a451e231037a77933b9d9cd46097d0ece936022210ae5ceeff04c9357431e6ff0918c92fe122b1a2756b6e5ccdf26ab664b3532c18d4183c78abe720f859f08cb3ac687470a2ad51724849e256ef762fa75f0328bef6c994b6561eccefa574234d8e806273954a0b41d07e031cdd4c84675c8f32966ce7680102ce452eb15882ce67f5af82c5e94ae2eed799da53cd9493e01f97f0e056798c3fa170a703a82183344c794694948fbac6e9e80513cf6b546cde067e7eec6b13b7d475e35aeea5c27f32877dfef29e87ff561e04f39e0f029b684a5cde3010026854d67dd0784fae225febf3fbed357e4b13786a0325e858c83d2cac6929d44c61b4b4bcaec297239e64f38f7dadd6cef424d5f380774447313a0e37405cdc676690e77c8ebf7f5a37eaf8880c40633c75e8e912c1993b5e16407cc94b338e82ab791d32a2137702b2819a62ec4c15243abb7b9b655f1d211e03f33dd67a91ffeb2f3bd23a82418ef72f7aadf12b9f29ae64cb0afa324b7413316bc886eeac804b72524ac2d608deaeba641e1f2fa41d46";


    uint256 constant EMPTY_TREE_SIZE = 61 * 32; // 32 bytes per 61 indexes (64 words)

    function getPristineHash(uint8 _log2Size) public pure returns (bytes32) {
        require(_log2Size >= 3, "Has to be at least one word");
        require(_log2Size <= 64, "Cannot be bigger than the machine itself");

        bytes8 value = 0;
        bytes32 runningHash = keccak256(abi.encodePacked(value));

        for (uint256 i = 3; i < _log2Size; i++) {
            runningHash = keccak256(abi.encodePacked(runningHash, runningHash));
        }

        return runningHash;
    }

    function getRoot(
        uint64 _position,
        bytes8 _value,
        bytes32[] memory proof
    ) public pure returns (bytes32) {
        bytes32 runningHash = keccak256(abi.encodePacked(_value));

        return getRootWithDrive(_position, 3, runningHash, proof);
    }

    function getRootWithDrive(
        uint64 _position,
        uint8 _logOfSize,
        bytes32 _drive,
        bytes32[] memory siblings
    ) public pure returns (bytes32) {
        require(_logOfSize >= 3, "Must be at least a word");
        require(_logOfSize <= 64, "Cannot be bigger than the machine itself");

        uint64 size = uint64(2)**_logOfSize;

        require(((size - 1) & _position) == 0, "Position is not aligned");
        require(
            siblings.length == 64 - _logOfSize,
            "Proof length does not match"
        );

        bytes32 drive = _drive;

        for (uint64 i = 0; i < siblings.length; i++) {
            if ((_position & (size << i)) == 0) {
                drive = keccak256(abi.encodePacked(drive, siblings[i]));
            } else {
                drive = keccak256(abi.encodePacked(siblings[i], drive));
            }
        }

        return drive;
    }

    function getEmptyTreeHashAtIndex(uint256 _index)
        public
        pure
        returns (bytes32)
    {
        uint256 start = _index.mul(32);
        require(
            EMPTY_TREE_SIZE >= start.add(32),
            "index out of bounds"
        );
        bytes32 hashedZeros;
        bytes memory zeroTree = EMPTY_TREE_HASHES;

        // first word is length, then skip index words
        assembly {
            hashedZeros := mload(add(add(zeroTree, 0x20), start))
        }
        return hashedZeros;
    }

    function getMerkleRootFromBytes(
        bytes calldata _data,
        uint8 _log2Size
    )
    public
    pure
    returns (bytes32)
    {
        require(_log2Size >= 3, "Must be at least a word");

        // shouldnt this be 61? Cause the word is 8 bytes
        require(_log2Size <= 64, "Cannot be bigger than the machine itself");

        uint256 size = 1 << uint256(_log2Size); // this is the total size of the drive
        uint256 stack_depth =  1 + (64 - ((_data.length + 7) >> L_WORD_SIZE).clz());
        bytes32[] memory stack = new bytes32[](stack_depth);

        uint256 numOfHashes;
        uint256 stackLength;

        while (numOfHashes < size) {
            uint256 numOfJoins;

            if ((numOfHashes << L_WORD_SIZE) < _data.length) {
                // we still have words to hash
                stack[numOfHashes] = getHashOfWordAtIndex(_data, numOfHashes);
                numOfHashes++;

                numOfJoins = numOfHashes;
            } else {
                // since padding happens in hashOfWordAtIndex function
                // we only need to complete the stack with pre-computed
                // hash(0), hash(hash(0),hash(0)) and so on
                uint256 topStackLevel = numOfHashes.ctz();

                stack[numOfHashes] = getEmptyTreeHashAtIndex(topStackLevel);

                numOfHashes = numOfHashes.add(1 << topStackLevel); //Empty Tree Hash summarizes many hashes
            }

            stackLength++;

            while (numOfJoins & 1 == 0) {
                bytes32 h2 = stack[stackLength - 1];
                bytes32 h1 = stack[stackLength - 2];

                stack[stackLength - 2] = keccak256(abi.encodePacked(h1, h2));
                stackLength = stackLength.sub(1); // remove hashes from stack

                numOfJoins = numOfJoins >> 1;
            }
        }
        require(
            stackLength == 1,
            "function ended but stack has more than one element"
        );

        return stack[stackLength];
    }

    function getHashOfWordAtIndex(
        bytes calldata _data,
        uint256 _wordIndex
    ) public pure returns (bytes32) {
        uint256 start = _wordIndex << L_WORD_SIZE;
        uint256 end = start.add(1 << L_WORD_SIZE);

        // TODO: in .lua this just returns zero, but this might be more consistent
        require(start <= _data.length, "word out of bounds");

        if (end <= _data.length) {
            return keccak256(
                abi.encodePacked(
                    _data[start : end]
                )
            );
        }

        // word is incomplete
        // fill paddedSlice with incomplete words - the rest is going to be bytes(0)
        bytes memory paddedSlice = new bytes(8);
        uint256 remaining = _data.length.sub(start);

        for (uint256 i = 0; i < remaining; i++) {
             paddedSlice[i] =  _data[start.add(i)];
        }

        return keccak256(paddedSlice);
    }

    /// @notice Calculate the root of Merkle tree from an array of power of 2 elements
    /// @param hashes The array containing power of 2 elements
    /// @return byte32 the root hash being calculated
    function calculateRootFromPowerOfTwo(bytes32[] memory hashes)
        public
        pure
        returns (bytes32)
    {
        // revert when the input is not of power of 2
        require(
            (hashes.length).isPowerOf2(),
            "The input array must contain power of 2 elements"
        );

        if (hashes.length == 1) {
            return hashes[0];
        } else {
            bytes32[] memory newHashes = new bytes32[](hashes.length >> 1);

            for (uint256 i = 0; i < hashes.length; i += 2) {
                newHashes[i >> 1] = keccak256(
                    abi.encodePacked(hashes[i], hashes[i + 1])
                );
            }

            return calculateRootFromPowerOfTwo(newHashes);
        }
    }
}
