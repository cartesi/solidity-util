pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./CartesiMath.sol";
import "./Instantiator.sol";
import "./Decorated.sol";

contract SpeedBump is Instantiator, Decorated, CartesiMath{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct SpeedBumpCtx {
        mapping(uint256 => address) roundWinner; // each rounds winner
        uint256 roundCount; // how many draw rounds happened
        uint256 currentDrawStartTime; // timestamp of when current draw started
        uint256 difficulty; // difficulty parameter defines how big the interval will be
        uint256 difficultyAdjustmentParameter; // how fast the difficulty gets adjusted to reach the desired draw time
        uint256 desiredDrawTimeInterval; // desired draw time interval, used to tune difficulty
        uint256 currentGoalBlockNumber; // block number which will decide current draw's goal

        IERC20 token; // ERC20 basic token contract being held
    }

    mapping(uint256 => SpeedBumpCtx) internal instance;

    function instantiate(
        uint256 _difficultyAdjustmentParameter,
        uint256 _desiredDrawTimeInterval,
        IERC20 _token) public returns (uint256)
    {
        require(_desiredDrawTimeInterval > 30, "Desired draw time interval has to be bigger than 30 seconds");
        instance[currentIndex].difficulty = 1;
        instance[currentIndex].difficultyAdjustmentParameter = _difficultyAdjustmentParameter;
        instance[currentIndex].desiredDrawTimeInterval = _desiredDrawTimeInterval;
        instance[currentIndex].token = _token;

        instance[currentIndex].currentGoalBlockNumber = block.number + 1; // goal has to be in the future, so miner cant manipulate (easily)
        instance[currentIndex].currentDrawStartTime = now; // first draw starts when the instance is created

        active[currentIndex] = true;
        return currentIndex++;
    }

    function getLogOfWeightedDistance(uint256 _index) public returns (uint256) {
        // intervalos sempre zero e outro número
        bytes32 currentGoal = blockhash(instance[_index].currentGoalBlockNumber);
        bytes32 hashedAddress = keccak256(abi.encodePacked(msg.sender));
        uint256 stakedBalance = instance[currentIndex].token.balanceOf(msg.sender); // this is supposed to be staked balance not full balance
        uint256 distance = uint256(currentGoal) - uint256(hashedAddress); // not safemath, we need overflow

        return CartesiMath.log2ApproxTimes1M(distance.div(stakedBalance));
    }

    function claimRound(uint256 _index) public returns (bool) {

        if ((block.number).sub(instance[_index].currentGoalBlockNumber) > 255) {
            // cannot get hash of block if its older than 256
            // so update goal and return false
            // new goal cannot be in the past, otherwise user could "choose it"
            instance[_index].currentGoalBlockNumber = block.number + 1;

            return false;
        }

        uint256 timePassedMicroSeconds = (now.sub(instance[_index].currentDrawStartTime)).mul(1000000); // time since draw started times 1e6 (microseconds)

        if (getLogOfWeightedDistance(_index) < instance[_index].difficulty.mul(timePassedMicroSeconds)) {
            instance[_index].roundWinner[instance[_index].roundCount] = msg.sender;
            _adjustDifficulty(_index);
            _reset(_index);
            return true;
        }
        return false;
    }

    function _reset(uint256 _index) private {
        instance[_index].roundCount++;
        instance[_index].currentGoalBlockNumber = block.number + 1;
        instance[_index].currentDrawStartTime = now;
    }

    function _adjustDifficulty(uint256 _index) private {
        if (now.sub(instance[_index].currentDrawStartTime) < instance[_index].desiredDrawTimeInterval) {
            instance[_index].difficulty.add(instance[_index].difficultyAdjustmentParameter); // maybe this should be multiplication instead of addition
        } else if (now.sub(instance[_index].currentDrawStartTime) > instance[_index].desiredDrawTimeInterval) {
            instance[_index].difficulty.sub(instance[_index].difficultyAdjustmentParameter); // maybe this should be division instead of sub
        }
    }
}
