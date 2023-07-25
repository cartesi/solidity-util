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

import {
    Chain,
    arbitrum,
    arbitrumGoerli,
    avalanche,
    avalancheFuji,
    bsc,
    bscTestnet,
    celo,
    celoAlfajores,
    fantom,
    fantomTestnet,
    gnosis,
    gnosisChiado,
    goerli,
    iotex,
    iotexTestnet,
    mainnet,
    metis,
    metisGoerli,
    optimism,
    optimismGoerli,
    polygon,
    polygonMumbai,
    sepolia,
} from "@wagmi/chains";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import "solidity-coverage";

// read MNEMONIC from file or from env variable
let mnemonic = process.env.MNEMONIC;

const networkConfig = (chain: Chain): HttpNetworkUserConfig => {
    let url = chain.rpcUrls.public.http.at(0);

    // support for infura and alchemy URLs through env variables
    if (process.env.INFURA_ID && chain.rpcUrls.infura?.http) {
        url = `${chain.rpcUrls.infura.http}/${process.env.INFURA_ID}`;
    } else if (process.env.ALCHEMY_ID && chain.rpcUrls.alchemy?.http) {
        url = `${chain.rpcUrls.alchemy.http}/${process.env.ALCHEMY_ID}`;
    }

    return {
        chainId: chain.id,
        url,
        accounts: mnemonic ? { mnemonic } : undefined,
    };
};

const config: HardhatUserConfig = {
    networks: {
        hardhat: mnemonic ? { accounts: { mnemonic } } : {},
        localhost: {
            url: process.env.RPC_URL || "http://localhost:8545",
            accounts: mnemonic ? { mnemonic } : undefined,
        },
        arbitrum: networkConfig(arbitrum),
        arbitrum_goerli: networkConfig(arbitrumGoerli),
        avalanche: networkConfig(avalanche),
        avalanche_fuji: networkConfig(avalancheFuji),
        bsc: networkConfig(bsc),
        bsc_testnet: networkConfig(bscTestnet),
        celo: networkConfig(celo),
        celo_testnet: networkConfig(celoAlfajores),
        chiado: networkConfig(gnosisChiado),
        fantom: networkConfig(fantom),
        fantom_testnet: networkConfig(fantomTestnet),
        gnosis: networkConfig(gnosis),
        goerli: networkConfig(goerli),
        iotex: networkConfig(iotex),
        iotex_testnet: networkConfig(iotexTestnet),
        mainnet: networkConfig(mainnet),
        metis: networkConfig(metis),
        metis_goerli: networkConfig(metisGoerli),
        optimism: networkConfig(optimism),
        optimism_goerli: networkConfig(optimismGoerli),
        polygon: networkConfig(polygon),
        polygon_mumbai: networkConfig(polygonMumbai),
        sepolia: networkConfig(sepolia),
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
        // networks will use another deterministic deployment proxy
        // https://github.com/safe-global/safe-singleton-factory
        const chainId = parseInt(network);
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
                `unsupported deterministic deployment for network ${network}`,
            );
            return undefined;
        }
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
