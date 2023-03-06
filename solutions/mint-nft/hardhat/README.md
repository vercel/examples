# Mint NFT Hardhat

## Prerequisites
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/)/[Yarn](https://yarnpkg.com/)/[PNPM](https://pnpm.io/)
- [Polygon Mumbai RPC Node](https://moralis.io/largenodes)
- [(Optional) Polygonscan API Key](https://polygonscan.com)

## Get Started

## 1. Install Dependencies

```sh
# NPM
npm i

# Yarn
yarn
```

## 2. Add Environment Variables and Mnemonics

Duplicate `.env.example` file and rename it as `.env` file. Then, fill in the following variables.

```
# Get RPC Node at https://moralis.io/largenodes
GOERLI_RPC_NODE=xxx
# (Optional) Get API Key at https://etherscan.io/
ETHERSCAN_API_KEY=xxx
```

For mnemonics, simply create a `.secret` file under the `hardhat` folder and paste the 12-words or 24-words mnemonic into the `.secret` file.

## 3. Compile NFT Contract

To compile the NFT smart contract, you can simply run the following command:

```sh
yarn compile
```

Once the compilation process is successful, you will have `artifacts` folder created, which will contain all the ABIs needed to deploy interact with your smart contract.

## 4. Deploy NFT Contract

Run the following command to deploy your compiled NFT contract:

```sh
yarn deploy
```

Once the deployment is successful, you will get a contract address to verify in the next step.

## 5. Verify NFT Contract on PolygonScan

To verify your NFT contract on Etherscan, simply run the following command:

```sh
yarn verify <contract-address>

```
