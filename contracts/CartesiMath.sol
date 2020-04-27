// Copyright 2019 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


pragma solidity ^0.5.0;


contract CartesiMath {

    mapping(uint256 => uint256) log2tableTimes1k;

    constructor() public {
        log2tableTimes1k[1] = 0;
        log2tableTimes1k[2] = 1000;
        log2tableTimes1k[3] = 1584;
        log2tableTimes1k[4] = 2000;
        log2tableTimes1k[5] = 2321;
    }

    function log2ApproxTimes1k(uint256 num) public returns (uint256) {
        require (num > 0, "Number cannot be zero");
        uint256 leading = 0;
        uint256 original = num;

        if (num == 1) return 0;

        while (log2tableTimes1k[num] == 0) {
           num = num >> 1;
           leading += 1;
       }
       return log2tableTimes1k[original] = (leading * 1000) + log2tableTimes1k[num];
    }
}
