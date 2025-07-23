const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MyToken = await ethers.getContractFactory("MyToken");

  console.log("Deploying MyToken...");
  // Deploy the contract
  const mytoken = await MyToken.deploy();
  // Wait for deployment to complete
 await mytoken.waitForDeployment();
  console.log("MyToken deployed at:", await mytoken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});