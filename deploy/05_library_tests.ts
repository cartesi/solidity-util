import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const { BitmaskLibrary, CartesiMath } = await deployments.all();

    await deploy("TestBitmaskLibrary", {
        from: deployer,
        log: true,
        libraries: {
            ["BitmaskLibrary"]: BitmaskLibrary.address
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
