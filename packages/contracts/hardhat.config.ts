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
import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
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

const chainIds: Record<string, number> = {
    arbitrum: 42161,
    arbitrum_goerli: 421613,
    avalanche: 43114,
    avalanche_fuji: 43113,
    bsc: 56,
    bsc_testnet: 97,
    chiado: 10200,
    gnosis: 100,
    goerli: 5,
    iotex: 4689,
    iotex_testnet: 4690,
    mainnet: 1,
    metis: 1088,
    metis_goerli: 599,
    optimism: 10,
    optimism_goerli: 420,
    polygon: 137,
    polygon_mumbai: 80001,
    sepolia: 11155111,
};

const config: HardhatUserConfig = {
    networks: {
        hardhat: mnemonic ? { accounts: { mnemonic } } : {},
        localhost: {
            url: process.env.RPC_URL || "http://localhost:8545",
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        arbitrum: ankr("arbitrum", chainIds.arbitrum),
        arbitrum_goerli: {
            url: "https://goerli-rollup.arbitrum.io/rpc",
            chainId: chainIds.arbitrum_goerli,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        avalanche: ankr("avalanche", chainIds.avalanche),
        avalanche_fuji: ankr("avalanche_fuji", chainIds.avalanche_fuji),
        bsc: ankr("bsc", chainIds.bsc),
        bsc_testnet: ankr("bsc_testnet_chapel", chainIds.bsc_testnet),
        chiado: {
            url: "https://rpc.chiadochain.net",
            chainId: chainIds.chiado,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        gnosis: ankr("gnosis", chainIds.gnosis),
        goerli: ankr("eth_goerli", chainIds.goerli),
        iotex: ankr("iotex", chainIds.iotex),
        iotex_testnet: {
            url: "https://babel-api.testnet.iotex.io",
            chainId: chainIds.iotex_testnet,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        mainnet: ankr("eth", chainIds.mainnet),
        metis: {
            url: "https://metis-rpc.gateway.pokt.network",
            chainId: 1088,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        metis_goerli: {
            url: "https://goerli.gateway.metisdevops.link",
            chainId: chainIds.metis_goerli,
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        optimism: ankr("optimism", chainIds.optimism),
        optimism_goerli: ankr("optimism_testnet", chainIds.optimism_goerli),
        polygon: ankr("polygon", chainIds.polygon),
        polygon_mumbai: ankr("polygon_mumbai", chainIds.polygon_mumbai),
        sepolia: ankr("eth_sepolia", chainIds.sepolia),
    },
    solidity: {
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                    evmVersion: "paris",
                },
            },
        ],
    },
    deterministicDeployment: (network: string) => {
        // networks that will use another deterministic deployment proxy
        // https://github.com/safe-global/safe-singleton-factory
        const ssf = [
            chainIds.iotex,
            chainIds.iotex_testnet,
            chainIds.metis,
            chainIds.metis_goerli,
        ];
        const chainId = parseInt(network);

        if (ssf.indexOf(chainId) != -1) {
            const info = getSingletonFactoryInfo(chainId);
            if (info) {
                return {
                    factory: info.address,
                    deployer: info.signerAddress,
                    funding: (
                        BigInt(info.gasPrice) * BigInt(info.gasLimit)
                    ).toString(),
                    signedTx: info.transaction,
                };
            } else {
                console.warn(
                    `unsupported deterministic deployment for network ${network}`
                );
                return undefined;
            }
        }
        return undefined;
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
