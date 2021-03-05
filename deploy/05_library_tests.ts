import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const { BitMaskLibrary, CartesiMath } = await deployments.all();

    await deploy("TestBitMaskLibrary", {
        from: deployer,
        log: true,
        libraries: {
            ["BitMaskLibrary"]: BitMaskLibrary.address
        },
    });

    await deploy("TestCartesiMath", {
        from: deployer,
        log: true,
        libraries: {
            ["CartesiMath"]: CartesiMath.address
        },
    });
};

export default func;
export const tags = ['TestCartesiMath'];
