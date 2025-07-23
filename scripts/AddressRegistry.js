// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Replace these with your actual addresses
  const precompiledAddress = "0x0000000000000000000000000000000000001003";
  const adminAddress = "0x32D5a21376C0dF3F98200a00380b06adeE341B91";
  // Get the contract factory
  const AddressRegistry = await ethers.getContractFactory("AddressRegistry");

  console.log("Deploying AddressRegistry...");

  // Deploy the contract
  const addressRegistry = await AddressRegistry.deploy(precompiledAddress, adminAddress);
  // Wait for deployment to complete
 await addressRegistry.waitForDeployment();
  console.log("AddressRegistry deployed at:", await addressRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});