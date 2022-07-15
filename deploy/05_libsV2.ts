// Copyright 2021 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (bre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = bre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("BitsManipulation", { from: deployer, log: true });
    await deploy("Bitmask", { from: deployer, log: true });

    const CartesiMathV2 = await deploy("CartesiMathV2", { from: deployer, log: true });
    await deploy("MerkleV2", {
        from: deployer,
        log: true,
        libraries: { CartesiMathV2: CartesiMathV2.address },
    });
};

export default func;
export const tags = ["LibsV2"];
