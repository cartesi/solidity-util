> :warning: The Cartesi team keeps working internally on the next version of this repository, following its regular development roadmap. Whenever there's a new version ready or important fix, these are published to the public source tree as new releases.

# solidity-util

Basic solidity contracts and solidity libraries used the Cartesi on-chain code.

Packaged as npm and published at https://www.npmjs.com/package/@cartesi/util

The npm package contains deployment information of contracts to testnets (`ropsten`, `kovan` and `rinkeby`).
In the future it may also include deployment to `mainnet`.

## Getting Started

To use this package in another truffle project you must include as a dependency in `package.json`.

    "dependencies": {
        "@cartesi/util": "<version>"
    },

And in your solidity contract import it as:

    import "@cartesi/util/contracts/Instantiator.sol";

You can also use the deployed contract:

    const contract = require("@truffle/contract");
    const BitsManipulationLibrary = contract(require("@cartesi/util/build/contracts/BitsManipulationLibrary.json"));
    BitsManipulationLibrary.setNetwork(4); // for rinkeby

## Build

To get a list of all available `npm` targets run:

```shell
% npm run info
```

## Contributing

Thank you for your interest in Cartesi! Head over to our [Contributing Guidelines](CONTRIBUTING.md) for instructions on how to sign our Contributors Agreement and get started with Cartesi!

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## License
The machine-solidity-step repository and all contributions are licensed under
[APACHE 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please review our [LICENSE](LICENSE) file.
