# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changes

- Rename network gnosis_chiado to just chiado

## [5.0.1] - 2022-11-14

### Changed

- Fix definition of tags and dependencies in deploy scripts

## [5.0.0] - 2022-11-02

### Changes

### Added

- Deployment to mainnet
- Deployment to gnosis chiado (gnosis testnet)

## [4.2.0] - 2022-09-01

### Changes

- Restore original CartesiMath contract to not trigger redeploy (formatting changes only)

### Added

- Deployment to iotex_testnet

## [4.1.0] - 2022-08-22

### Added

- Deployment to arbitrum_goerli

## [4.0.0] - 2022-07-19

### Added

- Deployment to optimism_goerli

### Changes

- Upgrade solidity compiler to 0.8.15
- Update dependencies and project configuration
- Deprecating support for kovan, ropsten, rinkeby
- Restoring compatilibity with version 1.0.0 to keep contracts deployed to mainnet alive
- Rename deployment matic_testnet to polygon_mumbai

## [3.1.2] - 2021-09-01

### Changes

- Optimization of Merkle
- Optimization of Bitmask

## [3.1.1] - 2021-06-28

### Added

- Deploy to ropsten

## [3.1.0] - 2021-06-13

### Added

- Add intra drive replacement function to Merkle

## [3.0.0] - 2021-05-11

### Changed

- Migration to solidity 0.8
- Removing SafeMath and OpenZeppelin
- Removing "Library" suffix from library contracts names
- [CartesiMath] New `ctz` and `clz` functions
- [CartesiMath] Gas optimization
- [Merkle] Bug fixes
- [Merkle] Using CartesiMath as library
- Removed `mainnet` deployment (will be back in a future release)

### Added

- [Bitmask] New library for keeping a bit mask efficiently

## [2.0.1] - 2021-03-11

### Changed

- Fix packaging procedure

## [2.0.0] - 2021-02-26

### Added

- Deployment to Avalanche

### Changed

- [CartesiMath] Convert to library

## [1.0.0] - 2020-12-02

### Changed

- [Instantiator] Remove deactivate method

### Added

- Deployment to mainnet

## [0.7.0] - 2020-11-26

### Added

- [WorkerManagerAuthManagerImpl] New implementation of WorkerManager and WorkerAuthManager in a single contract

## [0.6.2] - 2020-11-24

### Changed

- [CartesiMath] Update outdated artifact

## [0.6.1] - 2020-11-02

### Changed

- [CartesiMath] Update outdated artifact

## [0.6.0] - 2020-11-02

### Changed

- [CartesiMath] Turning CartesiMath into an abstract contract
- Dropping support for ropsten

## [0.5.2] - 2020-11-02

### Added

- Add TypeChain typings to npm package content

## [0.5.1] - 2020-11-02

### Added

- Add hardhat-deploy artifacts and lightweight abi

## [0.5.0] - 2020-10-28

### Changed

- Migration to hardhat

## [0.4.2] - 2020-09-15

### Changed

- [WorkerManager] Add isPending method

## [0.4.1] - 2020-09-11

### Added

- Deployment to goerli

## [0.4.0] - 2020-09-11

### Changed

- Migrate to solidity 0.7

### Added

- [WorkerManager] First implementation
- Deployment to BSC

## [0.3.0] - 2020-06-09

### Changed

- Migrate to solidity 0.6
- Using OpenZeppelin and SafeMath
- [CartesiMath] First implementation

### Added

- CI build

## [0.2.1] - 2020-03-31

### Change

- Adjust network gas configuration

## [0.2.0] - 2020-03-19

### Added

- Deployment to Matic

## [0.1.1] - 2019-12-12

### Changed

- Cleanup project dependencies

## [0.1.0] - 2019-12-09

### Added

- First public release

[unreleased]: https://github.com/cartesi/solidity-util/compare/v4.2.0...HEAD
[4.2.0]: https://github.com/cartesi/solidity-util/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/cartesi/solidity-util/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/cartesi/solidity-util/compare/v3.2.0...v4.0.0
[3.2.0]: https://github.com/cartesi/solidity-util/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/cartesi/solidity-util/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/cartesi/solidity-util/compare/v2.0.1...v3.0.0
[2.0.1]: https://github.com/cartesi/solidity-util/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/cartesi/solidity-util/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/cartesi/solidity-util/compare/v0.7.0...v1.0.0
[0.7.0]: https://github.com/cartesi/solidity-util/compare/v0.6.2...v0.7.0
[0.6.2]: https://github.com/cartesi/solidity-util/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/cartesi/solidity-util/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/cartesi/solidity-util/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/cartesi/solidity-util/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/cartesi/solidity-util/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/cartesi/solidity-util/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/cartesi/solidity-util/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/cartesi/solidity-util/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/cartesi/solidity-util/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/cartesi/solidity-util/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/cartesi/solidity-util/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/cartesi/solidity-util/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/cartesi/solidity-util/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/cartesi/solidity-util/releases/tag/v0.1.0
