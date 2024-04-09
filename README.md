# solidity-util

Basic solidity contracts and solidity libraries used the Cartesi on-chain code.

Packaged as npm and published at https://www.npmjs.com/package/@cartesi/util

The npm package contains `hardhat` deployment artifacts with information of deployed contracts on the following networks:

-   Arbitrum
-   Arbitrum Goerli
-   Arbitrum Sepolia
-   Avalanche
-   Avalanche Fuji
-   BNB Smart Chain
-   BNB Smart Chain Testnet
-   Celo
-   Celo Alfajores
-   Gnosis Chiado
-   Fantom
-   Fantom Testnet
-   Gnosis
-   Goerli
-   IoTex
-   IoTex Testnet
-   Mainnet
-   Metis
-   Metis Goerli
-   Optimism
-   Optimism Goerli
-   Optimism Sepolia
-   Polygon
-   Polygon Mumbai
-   Sepolia

Deployment was done using deterministic deployment with the [Safe Singleton Factory](https://github.com/safe-global/safe-singleton-factory) (with the exceptions of IoTex Testnet and Gnosis Chiado).

## Getting Started

To use this package in another project you must include as a dependency in `package.json`.

    "dependencies": {
        "@cartesi/util": "<version>"
    },

And in your solidity contract import it as:

    import "@cartesi/util/contracts/MerkleV2.sol";

## Build

To get a list of all available `pnpm` targets run the following inside `packages/contracts`:

    % pnpm run info

## Contributing

Thank you for your interest in Cartesi! Head over to our [Contributing Guidelines](CONTRIBUTING.md) for instructions on how to sign our Contributors Agreement and get started with Cartesi!

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## License

The solidity-util repository and all contributions are licensed under
[APACHE 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please review our [LICENSE](LICENSE) file.
