const CartesiMath = artifacts.require("CartesiMath");
const BigNumber = require('bignumber.js');

contract("CartesiMath", async accounts => {

    // testing log2ApproxTimes1M
    it("log2ApproxTimes1M should be a reasonable approximation of log2 * 1M", async () => {
        let max = 2 ** 256; // this should probably use BigNumber
        let min = 1;

        let numOfTestCases = 100;
        let instance = await CartesiMath.deployed();

        // generate random numbers between our log range (1 .. 2**256)
        for (var i = 0; i < numOfTestCases; i++) {
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            var logApprox = await instance.log2ApproxTimes1M(new BigNumber(random), {from: accounts[0]});
            var realLog = Math.log2(random) * 1000000;

            var error = Math.abs((realLog - logApprox) / realLog);

            console.log("RANDOM NUMBER: " + random);
            console.log("logApprox: " + logApprox);
            console.log("real log: " + realLog);
            console.log("ERROR: " + error);

            assert.isBelow(error, 0.1, "Error is bigger than 10%");
        }
    });

});
