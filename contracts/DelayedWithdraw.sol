// Copyright 2020 Cartesi Pte. Ltd.

// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

/// @title DelayedWithdraw
/// @author Felipe Argento
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DelayedWithdraw is Ownable {
    using SafeMath for uint256;

    uint256 constant delay = 7 days;

    Withdrawal private withdrawal;
    address public beneficiary;

    IERC20 ctsi;


    struct Withdrawal {
        uint amount;
        uint timestamp;
    }


    /// @notice Constructor
    /// @param _ctsi IERC20 that this contract is gonna work with
    /// @param _beneficiary address that will receive the withdraws
    constructor(IERC20 _ctsi, address _beneficiary) public {
        ctsi = _ctsi;
        beneficiary = _beneficiary;
    }

    /// @notice Creates a withdrawal request that will be finalized after delay time
    /// @param _amount amount of tokens for the request
    function requestWithdrawal(uint256 _amount) public onlyOwner() returns (bool) {
        require(_amount > 0, "withdrawal amount has to be bigger than 0");

        uint256 newAmount = withdrawal.amount.add(_amount);

        require(
            newAmount > ctsi.balanceOf(address(this)),
            "Not enough tokens in the contract for this Withdrawal request"
        );
        withdrawal.timestamp = block.timestamp;

        emit WithdrawRequested(withdrawal.amount, block.timestamp);

        return true;
    }

    /// @notice Finalizes withdraw and transfer the tokens to beneficiary
    function finalizeWithdraw() public onlyOwner returns (bool) {
        uint256 amount = withdrawal.amount;
        require(
            withdrawal.timestamp > block.timestamp.add(delay),
            "Withdrawal is not old enough to be finalized"
        );
        require(amount > 0, "There are no active withdrawal requests");

        withdrawal.amount = 0;
        ctsi.transfer(beneficiary, amount);

        emit WithdrawFinalized(amount, beneficiary);
        return true;
    }

    /// @notice Cancel any pending unfinalized withdrawal
    function cancelWithdrawal() public onlyOwner returns (bool) {
        require(withdrawal.amount > 0, "There are no active withdrawal requests");

        emit WithdrawCanceled(withdrawal.amount, block.timestamp);

        withdrawal.amount = 0;

        return true;
    }

    /// @notice Events signalling interactions
    event WithdrawRequested(uint256 _amount, uint256 _timestamp);
    event WithdrawCanceled(uint256 _amount, uint256 _timestamp);
    event WithdrawFinalized(uint256 _amount, address _beneficiary);
}
