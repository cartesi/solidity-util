// Copyright 2023 Cartesi Pte. Ltd.

// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

/// @title Bitmask Test
/// @author Daniel Ortega
pragma solidity ^0.8.0;

import {WorkerManager} from "contracts/WorkerManager.sol";
import {Test} from "forge-std/Test.sol";
import "forge-std/console.sol";

contract WorkerManagerTest is Test {
    WorkerManager workerManager;

    event JobOffer(address indexed worker, address indexed user);

    function setUp() public {
        workerManager = new WorkerManager();
    }

    function testIsAvailable(address payable _worker) public {
        vm.assume(_worker != address(0));
        assertEq(workerManager.isAvailable(_worker), true);
    }

    function testHire(address payable _worker) public {
        vm.assume(_worker != address(0));
        _worker = payable(vm.addr(2));
        address payable _contractor = payable(vm.addr(3));
        console.log(_worker);
        _contractor.transfer(0.01 ether);

        vm.startPrank(_contractor);
        workerManager.hire{value: 0.01 ether}(_worker);

        vm.expectEmit(true, false, false, false);
        emit JobOffer(_worker, msg.sender);

        //console.logUint(address(_worker).balance);
        assertEq(address(_worker).balance, 10000000000000000);
        vm.stopPrank();
    }
}
