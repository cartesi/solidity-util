pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./Instantiator.sol";
import "./Decorated.sol";

contract SpeedBump is Instantiator, Decorated {
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
        uint256 _difficulty,
        uint256 _difficultyAdjustmentParameter,
        uint256 _desiredDrawTimeInterval,
        IERC20 _token) public returns (uint256)
    {
        require(_desiredDrawTimeInterval > 0, "Desired draw time interval has to be bigger than zero");
        instance[currentIndex].difficulty = _difficulty;
        instance[currentIndex].difficultyAdjustmentParameter = _difficultyAdjustmentParameter;
        instance[currentIndex].desiredDrawTimeInterval = _desiredDrawTimeInterval;
        instance[currentIndex].token = _token;

        instance[currentIndex].currentGoalBlockNumber = block.number + 1; // goal has to be in the future, so miner cant manipulate (easily)
        instance[currentIndex].currentDrawStartTime = now; // first draw starts when the instance is created

        active[currentIndex] = true;
        return currentIndex++;
    }

    function getCurrentInterval(uint256 _index, uint256 _stakedBalance) public view returns (uint256) {
        // intervalos sempre zero e outro número
        uint256 timePassedMicroSeconds = (now.sub(instance[_index].currentDrawStartTime)).mul(1000000); // time since draw started times 1e6 (microseconds)

        uint256 exponent = timePassedMicroSeconds.div(instance[_index].difficulty);

        // TO-DO: check if solidity's exponentiation is ok here
        return _stakedBalance.mul(2 ** exponent);
    }

    function claimRound(uint256 _index) returns (bool) {

        if ((block.number).sub(instance[_index].currentGoalBlockNumber) > 255) {
            // cannot get hash of block if its older than 256
            // so update goal and return false
            // new goal cannot be in the past, otherwise user could "choose it"
            instance[_index].currentGoalBlockNumber = block.number + 1;

            return false;
        }

        bytes32 currentGoal = blockhash(instance[_index].currentGoalBlockNumber);
        bytes32 hashedAddress = keccak256(msg.sender);
        uint256 stakedBalance = token.balanceOf(msg.sender); // this is supposed to be staked balance not full balance

        // no safemath because we expect overflow
        if ((hashedAddress + currentGoal) < getCurrentInterval(_index, stakedBalance)) {
            roundWinner[roundCount] = msg.sender;
            _adjustDifficulty();
            _reset();

            return true;
        }
        return false;
    }

    function _reset(uint256 _index) private {
        instance[_index].roundCount++;
        instance[_index].currentGoalBlockNumber = blockhash(block.number + 1);
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
