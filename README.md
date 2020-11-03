> :warning: The Cartesi team keeps working internally on the next version of this repository, following its regular development roadmap. Whenever there's a new version ready or important fix, these are published to the public source tree as new releases.

# solidity-util

Basic solidity contracts and solidity libraries used the Cartesi on-chain code.

Packaged as npm and published at https://www.npmjs.com/package/@cartesi/util

The npm package contains `hardhat` deployment artifacts with information of deployed contracts on the following testnets:
- Rinkeby
- Kovan
- Goerli
- Matic Testnet
- Binance Smart Chain Testnet

In the future it may also include deployment to mainnets.

## Getting Started

To use this package in another project you must include as a dependency in `package.json`.

    "dependencies": {
        "@cartesi/util": "<version>"
    },

And in your solidity contract import it as:

    import "@cartesi/util/contracts/Instantiator.sol";

## Build

To get a list of all available `yarn` targets run:

```shell
% yarn run info
```

## Contributing

Thank you for your interest in Cartesi! Head over to our [Contributing Guidelines](CONTRIBUTING.md) for instructions on how to sign our Contributors Agreement and get started with Cartesi!

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## License
The solidity-util repository and all contributions are licensed under
[APACHE 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please review our [LICENSE](LICENSE) file.
