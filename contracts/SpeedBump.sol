pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract SpeedBump {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // ERC20 basic token contract being held
    IERC20 private _token;

    mapping(uint256 => address) public roundWinner;

    uint256 public roundCount; // how many speedbump rounds happened
    uint256 public lastSBStart; // timestamp of when last speedbump round started
    uint256 internal stakeWeight; // how much weight will be given to each token

    bytes32 internal goal;

    constructor(IERC20 token) {
        lastSBStart = now;
        goal = blockhash(block.number); //this should be a true random

        _token = token;
    }

    function getCurrentInterval() public returns (uint256, uint256) {
        return (
            goal.sub(2 ** (now.sub(lastSBStart))),
            goal.add(2 ** (now.sub(lastSBStart)))
        );
    }

    function claimRound() returns (bool) {
        bytes32 hashedAddress = keccak256(msg.sender);
        uint256 intervalModifier = balanceOf(msg.sender) * stakeWeight; // balanceOf should not be entire balance, only stake
        (uint256 lb, uint256 hb) = getCurrentInterval;

        if (hashedAddress > lb.sub(intervalModifier) && hashedAddress < hb.add(intervalModifier)) {
            roundWinner[roundCount] = msg.sender;
            _reset();

            return true;
        }
        return false;
    }

    function _reset() private {
        roundCount++;
        goal = blockhash(block.number); //this should be a true random
    }
}
