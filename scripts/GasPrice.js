// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Replace these with your actual addresses
  const precompiledAddress = "0x0000000000000000000000000000000000001003";
  const adminAddress = "0x32D5a21376C0dF3F98200a00380b06adeE341B91";
  // Get the contract factory
  const GasPrice = await ethers.getContractFactory("GasPrice");

  console.log("Deploying GasPrice...");

  // Deploy the contract
  const gasprice = await GasPrice.deploy(precompiledAddress, adminAddress);
  // Wait for deployment to complete
 await gasprice.waitForDeployment();
  console.log("GasPrice deployed at:", await gasprice.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});