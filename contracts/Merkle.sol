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

library Merkle {
    uint256 constant WORD_SIZE = 8; // one word contains 8 bytes

    //TODO: update empty tree hashes
    bytes constant EMPTY_TREE_HASHES =
        hex"0000000F4240182F421E8480236E082771822AD63A2DC6C0305E8532B04834C96736B3C23876D73A187A3B9D4A3D09003E5EA63FA0C540D17741F28843057D440BA745062945F60246DC1047B917488DC7495ABA4A207C4ADF8A4B98544C4B404CF8AA4DA0E64E44434EE3054F7D6D5013B750A61A5134C851BFF05247BD52CC58534DE753CC8D54486954C19C55384255AC75561E50568DE956FB575766B057D00758376F589CFA5900BA5962BC59C3135A21CA5A7EF15ADA945B34BF5B8D805BE4DF5C3AEA5C8FA95CE3265D356C5D86835DD6735E25455E73005EBFAD5F0B525F55F75F9FA25FE85A60302460770860BD0A61023061467F6189FD61CCAE620E98624FBF62902762CFD5630ECD634D12638AA963C7966403DC643F7F647A8264B4E864EEB56527EC6560906598A365D029660724663D9766738566A8F066DDDA6712476746386779AF67ACAF67DF3A6811526842FA68743268A4FC68D55C6905536934E169640A6992CF69C13169EF326A1CD46A4A186A76FF6AA38C6ACFC0";

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
        return EMPTY_TREE_HASHES[_index:_index * 32];
    }

    function getLog2Floor(uint256 number) public pure returns (uint8) {
        uint8 result = 0;

        uint256 checkNumber = number;
        checkNumber = checkNumber >> 1;
        while (checkNumber > 0) {
            ++result;
            checkNumber = checkNumber >> 1;
        }

        return result;
    }

    function isPowerOf2(uint256 number) public pure returns (bool) {
        uint256 checkNumber = number;
        if (checkNumber == 0) {
            return false;
        }

        while ((checkNumber & 1) == 0) {
            checkNumber = checkNumber >> 1;
        }

        checkNumber = checkNumber >> 1;

        if (checkNumber == 0) {
            return true;
        }

        return false;
    }

    function completeMerkleWithHashedZeros(
        uint8 _currentLog2Size,
        uint8 _fullLog2Size,
        bytes32 _root
    ) public pure returns (bytes32) {
        uint8 logDiff = _fullLog2Size - _currentLog2Size;
        bytes32 root = _root;

        for (uint256 i = 0; i <= logDiff; i++) {
            root = keccak256(
                abi.encodePacked(
                    root,
                    getEmptyTreeHashAtIndex(_currentLog2Size + i)
                )
            );
        }

        return root;
    }

    function getPaddedHashArrayFromBytes(bytes memory _data)
        public
        pure
        returns (bytes32[] memory)
    {
        // get data size next p2
        // add next power of 2 function
        uint256 nextP2 = nextPower2(_data.length / WORD_SIZE);

        uint256 numsToP2 = (_data.length / WORD_SIZE) - nextP2;

        // fix math -> padd till multiple of 8 then padd till power of 2
        // TODO: upgrade to solidity 8 or use safe math, overflow possibility
        bytes memory padding = new bytes(numsToP2);

        bytes newData = concat(_data, padding);

        // can optmize this with the tower of hanoi/2048 stack
        bytes32[] memory hashes = new bytes32[](newData.length / WORD_SIZE);

        for (uint256 i = 0; i < newData / WORD_SIZE; i++) {
            uint256 start = i * WORD_SIZE;
            uint256 end = (i + 1) * WORD_SIZE;

            // populate hashes array with keccack of 8 bytes slice of padded data
            hashes[i] = keccak256(abi.encodePacked(newData[start:end]));
        }

        return hashes;
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
            isPowerOf2(hashes.length),
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

    // copied from https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    // LICENSE: https://github.com/GNSPS/solidity-bytes-utils/blob/master/LICENSE
    function concat(bytes memory _preBytes, bytes memory _postBytes)
        internal
        pure
        returns (bytes memory)
    {
        bytes memory tempBytes;

        assembly {
            // Get a location of some free memory and store it in tempBytes as
            // Solidity does for memory variables.
            tempBytes := mload(0x40)

            // Store the length of the first bytes array at the beginning of
            // the memory for tempBytes.
            let length := mload(_preBytes)
            mstore(tempBytes, length)

            // Maintain a memory counter for the current write location in the
            // temp bytes array by adding the 32 bytes for the array length to
            // the starting location.
            let mc := add(tempBytes, 0x20)
            // Stop copying when the memory counter reaches the length of the
            // first bytes array.
            let end := add(mc, length)

            for {
                // Initialize a copy counter to the start of the _preBytes data,
                // 32 bytes into its memory.
                let cc := add(_preBytes, 0x20)
            } lt(mc, end) {
                // Increase both counters by 32 bytes each iteration.
                mc := add(mc, 0x20)
                cc := add(cc, 0x20)
            } {
                // Write the _preBytes data into the tempBytes memory 32 bytes
                // at a time.
                mstore(mc, mload(cc))
            }

            // Add the length of _postBytes to the current length of tempBytes
            // and store it as the new length in the first 32 bytes of the
            // tempBytes memory.
            length := mload(_postBytes)
            mstore(tempBytes, add(length, mload(tempBytes)))

            // Move the memory counter back from a multiple of 0x20 to the
            // actual end of the _preBytes data.
            mc := end
            // Stop copying when the memory counter reaches the new combined
            // length of the arrays.
            end := add(mc, length)

            for {
                let cc := add(_postBytes, 0x20)
            } lt(mc, end) {
                mc := add(mc, 0x20)
                cc := add(cc, 0x20)
            } {
                mstore(mc, mload(cc))
            }

            // Update the free-memory pointer by padding our last write location
            // to 32 bytes: add 31 bytes to the end of tempBytes to move to the
            // next 32 byte block, then round down to the nearest multiple of
            // 32. If the sum of the length of the two arrays is zero then add
            // one before rounding down to leave a blank 32 bytes (the length block with 0).
            mstore(
                0x40,
                and(
                    add(add(end, iszero(add(length, mload(_preBytes)))), 31),
                    not(31) // Round down to the nearest 32 bytes.
                )
            )
        }

        return tempBytes;
    }
}
