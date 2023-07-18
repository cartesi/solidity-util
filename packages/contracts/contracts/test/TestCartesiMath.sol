// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

/// @title Test CartesiMath
pragma solidity ^0.8.0;

import "../CartesiMathV2.sol";

contract TestCartesiMath {
    function getLog2TableTimes1M(uint256 _num) public pure returns (uint256) {
        return CartesiMathV2.getLog2TableTimes1M(_num);
    }

    function ctz(uint256 _num) public pure returns (uint256) {
        return CartesiMathV2.ctz(_num);
    }

    function clz(uint256 _num) public pure returns (uint256) {
        return CartesiMathV2.clz(_num);
    }

    function getLog2Floor(uint256 _num) public pure returns (uint256) {
        return CartesiMathV2.getLog2Floor(_num);
    }

    function isPowerOf2(uint256 _num) public pure returns (bool) {
        return CartesiMathV2.isPowerOf2(_num);
    }
}
