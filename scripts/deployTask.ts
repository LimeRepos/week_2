const hre = require('hardhat')
const ethers = hre.ethers;

async function deployLibraryContract() {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const [deployer] = await ethers.getSigners(); // We are getting the deployer
  
    await hre.run('print', { message: "Deploying contracts from: "+ deployer.address })
    await hre.run('print', { message: "Account balance: "+ (await deployer.getBalance()).toString() })

    const Library = await ethers.getContractFactory("Library");
    const lib = await Library.deploy();
    await hre.run('print', { message: "Waiting for deployment..." })
    await lib.deployed();

    await hre.run('print', { message: "Contract Address: "+ lib.address })
    await hre.run('print', { message: "Done! " })
}
  
module.exports = deployLibraryContract;