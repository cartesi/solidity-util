import {
    BuidlerRuntimeEnvironment,
    DeployFunction
} from "@nomiclabs/buidler/types";

import useOrDeploy from "../src/helpers/useOrDeploy";
const CTSI = require("@cartesi/token/build/contracts/CartesiToken.json");

const func: DeployFunction = async (bre: BuidlerRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = bre;
    const { deploy } = deployments;
    const a = await getNamedAccounts();
    const { deployer } = await getNamedAccounts();

    const CartesiTokenAddress = await useOrDeploy(bre, deployer, CTSI);
    await deploy("DelayedWithdraw", { from: deployer, args: [CartesiTokenAddress], log: true });
};

export default func;
export const tags = ['DelayedWithdraw'];
