import { HardhatUserConfig, task, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const INFURA_KEY: string = String(process.env.INFURA_KEY);
const ETHERSCAN_KEY: string = String(process.env.ETHERSCAN_KEY);
const PRIVATE_KEY: string = String(process.env.PRIVATE_KEY);


task("deploy-testnets", "Deploys contract on a provided network")
    .setAction(async () => {
        const deployLibraryContract = require("./scripts/deployTask");
        await deployLibraryContract();
});

subtask("print", "Prints a message")
    .addParam("message", "The message to print")
    .setAction(async (taskArgs) => {
      console.log(taskArgs.message);
});


const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: INFURA_KEY,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan:{
    apiKey: ETHERSCAN_KEY,
  }

};


export default config;
