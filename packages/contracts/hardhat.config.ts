// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-deploy";
import "solidity-coverage";

// read MNEMONIC from file or from env variable
let mnemonic = process.env.MNEMONIC;

const ankr = (
    network: string,
    chainId?: number,
    gas?: number
): HttpNetworkUserConfig => ({
    url: `https://rpc.ankr.com/${network}`,
    chainId,
    gas,
    accounts: mnemonic ? { mnemonic } : undefined,
});

const config: HardhatUserConfig = {
    networks: {
        hardhat: mnemonic ? { accounts: { mnemonic } } : {},
        localhost: {
            url: process.env.RPC_URL || "http://localhost:8545",
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        goerli: ankr("eth_goerli", 5),
        sepolia: ankr("eth_sepolia", 11155111),
        mainnet: ankr("eth", 1),
        polygon: ankr("polygon", 137),
        polygon_mumbai: ankr("polygon_mumbai", 80001),
        arbitrum: ankr("arbitrum", 42161),
        arbitrum_goerli: {
            url: "https://goerli-rollup.arbitrum.io/rpc",
            chainId: 421613,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        optimism: ankr("optimism", 10),
        optimism_goerli: ankr("optimism_testnet", 420),
        bsc: ankr("bsc", 56),
        bsc_testnet: ankr("bsc_testnet_chapel", 97),
        avalanche: ankr("avalanche", 43114),
        avalanche_fuji: ankr("avalanche_fuji", 43113),
        iotex: ankr("iotex", 4689),
        iotex_testnet: {
            url: "https://babel-api.testnet.iotex.io",
            chainId: 4690,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        gnosis: ankr("gnosis", 100),
        chiado: {
            url: "https://rpc.chiadochain.net",
            chainId: 10200,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                },
            },
        ],
    },
    paths: {
        artifacts: "artifacts",
        deploy: "deploy",
        deployments: "deployments",
    },
    typechain: {
        outDir: "src/types",
        target: "ethers-v6",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
};

export default config;
