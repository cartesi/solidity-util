import {
    BuidlerRuntimeEnvironment,
    DeployFunction
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async (bre: BuidlerRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = bre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const WorkerManagerImpl = await deployments.get("WorkerManagerImpl");

    await deploy("WorkerAuthManagerImpl", {
        from: deployer,
        args: [WorkerManagerImpl.address],
        log: true
    });
};

export default func;
export const tags = ["WorkerAuthManager"];
export const dependencies = ["WorkerManager"];
