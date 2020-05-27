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

    /// @notice Instantiates a Speed Bump structure
    /// @param _difficultyAdjustmentParameter how quickly the difficulty gets updated
    /// according to the difference between time passed and desired draw time interval.
    /// @param _desiredDrawTimeInterval how often we want to elect a winner
    /// @param _token which token will be used
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

    /// @notice Calculates the log of the distance between the goal and callers address
    /// @param _index the index of the instance of speedbump you want to interact with
    function getLogOfDistance(uint256 _index) internal view returns (uint256) {
        // intervalos sempre zero e outro número
        bytes32 currentGoal = blockhash(instance[_index].currentGoalBlockNumber);
        bytes32 hashedAddress = keccak256(abi.encodePacked(msg.sender));
        uint256 distance = uint256(keccak256(abi.encodePacked(hashedAddress, currentGoal)));

        return CartesiMath.log2ApproxTimes1M(distance);
    }

    /// @notice Claim yourself as the winner of a round
    /// @param _index the index of the instance of speedbump you want to interact with
    function claimRound(uint256 _index) public returns (bool) {

        if ((block.number).sub(instance[_index].currentGoalBlockNumber) > 220) {
            // cannot get hash of block if its older than 256, we set 220 to avoid edge cases
            // so update goal and return false
            // new goal cannot be in the past, otherwise user could "choose it"
            instance[_index].currentGoalBlockNumber = block.number + 1;

            return false;
        }

        uint256 timePassedMicroSeconds = (now.sub(instance[_index].currentDrawStartTime)).mul(1000000); // time since draw started times 1e6 (microseconds)
        uint256 stakedBalance = instance[currentIndex].token.balanceOf(msg.sender); // this is supposed to be staked balance not full balance
        // multiplications shouldnt overflow, subtraction should
        if ((stakedBalance.mul(timePassedMicroSeconds)) > instance[_index].difficulty.mul((256 - getLogOfDistance(_index)))) {
            instance[_index].roundWinner[instance[_index].roundCount] = msg.sender;
            instance[_index].difficulty = getNewDifficulty(
                instance[_index].difficulty,
                now.sub(instance[_index].currentDrawStartTime),
                instance[_index].desiredDrawTimeInterval,
                instance[_index].difficultyAdjustmentParameter
            );

            _reset(_index);
            return true;
        }
        return false;
    }

    /// @notice Reset instance, advancing round and choosing new goal
    /// @param _index the index of the instance of speedbump you want to interact with
    function _reset(uint256 _index) private {
        instance[_index].roundCount++;
        instance[_index].currentGoalBlockNumber = block.number + 1;
        instance[_index].currentDrawStartTime = now;
    }

    /// @notice Calculates new difficulty parameter
    /// @param _oldDifficulty is the difficulty of previous round
    /// @param _timePassed is how long the previous round took
    /// @param _desiredDrawTime is how long a round is supposed to take
    /// @param _adjustmentParam is how fast the difficulty gets adjusted
    function getNewDifficulty(uint256 _oldDifficulty, uint256 _timePassed, uint256 _desiredDrawTime, uint256 _adjustmentParam) internal pure returns (uint256) {
        // TODO: Discuss if this should be multiplication/Division or Addition/Subtraction
        if (_timePassed < _desiredDrawTime) {
            return _oldDifficulty.mul(_adjustmentParam);
        } else if (_timePassed > _desiredDrawTime) {
            return _oldDifficulty.div(_adjustmentParam);
        }

        return _oldDifficulty;
    }
}
