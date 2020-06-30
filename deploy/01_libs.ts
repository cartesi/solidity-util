import {
    BuidlerRuntimeEnvironment,
    DeployFunction
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async (bre: BuidlerRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = bre;
    const { deploy } = deployments;
    const a = await getNamedAccounts();
    const { deployer } = await getNamedAccounts();

    await deploy("BitsManipulationLibrary", { from: deployer, log: true });
    await deploy("Merkle", { from: deployer, log: true });
    await deploy("CartesiMath", { from: deployer, log: true });
};

export default func;
export const tags = ['Libs'];
