const { use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);


const advanceTime = async (provider, seconds) => {
  await provider.send("evm_increaseTime", [seconds]);
};
module.exports = {
  advanceTime,
};