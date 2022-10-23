# Library Hardhat Project

### Local Deployment

1. Run `npx hardhat node` to create your local node.

2. Run `npx hardhat run --network localhost scripts/deploy.ts` to deploy.

### Tests

1. Run `npx hardhat test` or `npx hardhat test --network localhost`

### Code coverage

1. Run `npx hardhat coverage`

### See Tasks

1. Run `npx hardhat`

### Run Tasks

1. Do: `npx hardhat TASK_NAME`

### Deploy contract

1. For local deployment run `npx hardhat deploy-testnets` or `npx hardhat deploy-testnets --network localhost`
1. For testnet deployment run `npx hardhat deploy-testnets --network goerli`

### Verify contract

1. Run `npx hardhat verify --network goerli "address"` once contract is deployed

### Verified Contract

The verified contract can be found [here](https://goerli.etherscan.io/address/0xCF8bD1b5EAEfFd6aB9ae511743D4AeeF03aDB424#code).

#### Dependencies installed

`npm install --save-dev @nomiclabs/hardhat-etherscan`
`npm install dotenv `
