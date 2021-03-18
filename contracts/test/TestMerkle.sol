// Copyright 2021 Cartesi Pte. Ltd.

// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

/// @title Test Merkle
pragma solidity ^0.7.0;

import "../Merkle.sol";

contract TestMerkle {
    
    function getPristineHash(uint8 _log2Size) public pure returns (bytes32) {        
        return Merkle.getPristineHash(_log2Size);
    }
    
    function getRoot(
        uint64 _position,
        bytes8 _value,
        bytes32[] memory proof
    ) public pure returns (bytes32) {
        return Merkle.getRoot(_position, _value, proof);
    }

    function getRootWithDrive(
        uint64 _position,
        uint8 _logOfSize,
        bytes32 _drive,
        bytes32[] memory siblings
    ) public pure returns (bytes32) {
        return Merkle.getRootWithDrive(_position, _logOfSize, _drive, siblings);
    }

    function getEmptyTreeHashAtIndex(uint256 _index)
        public
        pure
        returns (bytes32)
    {
        return Merkle.getEmptyTreeHashAtIndex(_index);
    }

    function getMerkleRootFromBytes(
        bytes calldata _data,
        uint8 _log2Size
    )
    public
    pure
    returns (bytes32)
    {
        return Merkle.getMerkleRootFromBytes(_data, _log2Size);
    }

    function getHashOfWordAtIndex(
        bytes calldata _data,
        uint256 _wordIndex
    ) public pure returns (bytes32) {
        return Merkle.getHashOfWordAtIndex(_data, _wordIndex);
    }

    function calculateRootFromPowerOfTwo(bytes32[] memory hashes)
        public
        pure
        returns (bytes32)
    {
        return Merkle.calculateRootFromPowerOfTwo(hashes);
    }
}
