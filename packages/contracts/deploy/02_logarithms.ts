// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // IoTeX doesn't have support yet, see https://github.com/safe-global/safe-singleton-factory/issues/199
    // Chiado is not working, see https://github.com/safe-global/safe-singleton-factory/issues/201
    const nonDeterministicNetworks = ["iotex_testnet", "chiado"];
    const deterministicDeployment = !nonDeterministicNetworks.includes(
        network.name
    );

    const opts: DeployOptions = {
        deterministicDeployment,
        from: deployer,
        log: true,
    };

    await deploy("UnrolledCordic", opts);
};

func.tags = ["Logarithms"];
export default func;
