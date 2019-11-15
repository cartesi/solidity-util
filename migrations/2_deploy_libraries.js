
const BitsManipulationLibrary = artifacts.require("BitsManipulationLibrary");
const Merkle = artifacts.require("Merkle");

module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {
        await deployer.deploy(BitsManipulationLibrary);
        await deployer.deploy(Merkle);
    });

};
