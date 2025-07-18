// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Replace these with your actual addresses
  const precompiledAddress = "0x0000000000000000000000000000000000001004";
  const adminAddress = "0x32D5a21376C0dF3F98200a00380b06adeE341B91";
  // Get the contract factory
  const GasPriceV2 = await ethers.getContractFactory("GasPriceV2");

  console.log("Deploying GasPriceV2...");

  // Deploy the contract
  const gaspriceV2 = await GasPriceV2.deploy(precompiledAddress, adminAddress);
  // Wait for deployment to complete
 await gaspriceV2.waitForDeployment();
  console.log("GasPriceV2 deployed at:", await gaspriceV2.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});