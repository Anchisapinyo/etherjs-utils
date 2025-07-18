// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Replace these with your actual addresses
  const precompiledAddress = "0x0000000000000000000000000000000000001001";
  const adminAddress = "0x32D5a21376C0dF3F98200a00380b06adeE341B91";
  // Get the contract factory
  const NativeMinterV2 = await ethers.getContractFactory("NativeMinterV2");

  console.log("Deploying NativeMinterV2...");

  // Deploy the contract
  const nativeMinter = await NativeMinterV2.deploy(precompiledAddress, adminAddress);
  // Wait for deployment to complete
 await nativeMinter.waitForDeployment();
  console.log("NativeMinterV2 deployed at:", await nativeMinter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
