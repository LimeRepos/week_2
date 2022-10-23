import { ethers } from "hardhat";

async function main() {

  const Library = await ethers.getContractFactory("Library");
  const lib = await Library.deploy();

  await lib.deployed();

  console.log(`Library was deployed`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
