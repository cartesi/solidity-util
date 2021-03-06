// Copyright 2021 Cartesi Pte. Ltd.

// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

pragma solidity ^0.7.0;

/// @title Bit Mask Library
/// @author Stephen Chen
/// @notice Implements bit mask with dynamic array
library BitmaskLibrary {
    /// @notice Set a bit in the bit mask
    function setBit(uint256[] storage bitMask, uint256 _bit) public {
        // calculate the number of bits has been store in bitMask now
        uint256 positionOfMask = _bit / 256;
        if (positionOfMask >= bitMask.length) {
            // not enough bit masks to hold the _bit, append more
            for (
                uint256 i = 0;
                i < (positionOfMask - bitMask.length + 1);
                i++
            ) {
                bitMask.push(0);
            }
        }
        uint256 positionOfBit = _bit % 256;

        bitMask[positionOfMask] =
            bitMask[positionOfMask] |
            (1 << positionOfBit);
    }

    /// @notice Get a bit in the bit mask
    function getBit(uint256[] memory bitMask, uint256 _bit)
        public
        pure
        returns (bool)
    {
        // calculate the number of bits has been store in bitMask now
        uint256 positionOfMask = _bit / 256;
        if (positionOfMask >= bitMask.length) {
            return false;
        }
        uint256 positionOfBit = _bit % 256;

        return (((bitMask[positionOfMask] >> positionOfBit) & 1) == 1);
    }
}
