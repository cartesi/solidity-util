// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

/// @title Test Merkle
pragma solidity ^0.8.0;

import "../MerkleV2.sol";

contract TestMerkle {
    function getRootAfterReplacementInDrive(
        uint256 _position,
        uint256 _logSizeOfReplacement,
        uint256 _logSizeOfFullDrive,
        bytes32 _replacement,
        bytes32[] memory siblings
    ) public pure returns (bytes32) {
        return
            MerkleV2.getRootAfterReplacementInDrive(
                _position,
                _logSizeOfReplacement,
                _logSizeOfFullDrive,
                _replacement,
                siblings
            );
    }

    function getEmptyTreeHashAtIndex(uint256 _index) public pure returns (bytes32) {
        return MerkleV2.getEmptyTreeHashAtIndex(_index);
    }

    function getMerkleRootFromBytes(bytes calldata _data, uint256 _log2Size) public pure returns (bytes32) {
        return MerkleV2.getMerkleRootFromBytes(_data, _log2Size);
    }

    function getHashOfWordAtIndex(bytes calldata _data, uint256 _wordIndex) public pure returns (bytes32) {
        return MerkleV2.getHashOfWordAtIndex(_data, _wordIndex);
    }

    function calculateRootFromPowerOfTwo(bytes32[] memory hashes) public pure returns (bytes32) {
        return MerkleV2.calculateRootFromPowerOfTwo(hashes);
    }
}
