const { ethers, Wallet, parseEther } = require("ethers");

// const nativeMinterContractAddress = "0x0000000000000000000000000000000000001001";
const addressRegistryContractAddress =
  "0x0000000000000000000000000000000000001002";
// const gasPriceContractAddress = "0x0000000000000000000000000000000000001003";
const revenueRatioContractAddress =
  "0x0000000000000000000000000000000000001004";
const treasuryRegistryContractAddress =
  "0x0000000000000000000000000000000000001005";
// const gasFeeGrantContract = "0x0000000000000000000000000000000000001006"

const provider = new ethers.JsonRpcProvider();

const adminPK =
  "0x824a4db5d74578087c44b11965c92b0857daf20f3196c05de09d5d4d97dc2d8a";
const userPK =
  "0xaaaf363347b1c3c01ddf274573018939d8f9ad23b5b53bb95e8b173eee4ec36e";
const initiatorPK =
  "0x13bae1c7406f29717a7c20cd20a1b62a68c8fe593aa030e5f52d33d60a5ac5e1";
const privateKey = "0x675a20025082dcc11ac621eb70e549f1cddfabb9957b62946418ee84859a86cd";
const wallet = new Wallet(privateKey, provider);

const validatorAddress = "0xEDFAA84E3E8d6d23Fa0b5A2b66D988f9557362A5";

// wallet account
const adminAccount = new ethers.Wallet(adminPK, provider);
const userAccount = new ethers.Wallet(userPK, provider); 
const initiatorAccount2 = new ethers.Wallet(initiatorPK, provider);
const treasuryAccount = "0x5B8C9F15bF96541978782ACa58908d260924BF85"
const initiatorAccount = "0xAbE6CBd690685Bff226E1E4230B72757d37505b4"
const receiverAddress = "0x933A29Acf3D8b4BBb8bf619E866C21984F1EaBD8";

const addressRegistryABI = [
  "function initializeOwner(address account) public returns (bool)",
  "function addToRegistry(address account, address initiator) public returns (bool)",
  "function contains(address account) public view returns (bool)",
  "function discovery(address account) public view returns (address)",
];

const treasuryRegistryABI = [
  "function initializeOwner(address account) public returns (bool)",
  "function setTreasury(address newTreasury) public returns (bool)",
  "function treasuryAt() public view returns (address)",
];

const revenueRatioABI = [
  "function initializeOwner(address account) public returns (bool)",
  "function enable() public returns (bool)",
  "function status() public view returns (bool)",
  "function setRevenueRatio(uint8 contractRatio, uint8 coinbaseRatio, uint8 providerRatio, uint8 treasuryRatio) public returns (bool)",
];

// contract connect to precompile
const addressRegistry = new ethers.Contract(
  addressRegistryContractAddress,
  addressRegistryABI,
  adminAccount
);

const revenueRatioContract = new ethers.Contract(
  revenueRatioContractAddress,
  revenueRatioABI,
  adminAccount
);
const treasuryRegistryContract = new ethers.Contract(
  treasuryRegistryContractAddress,
  treasuryRegistryABI,
  adminAccount
);

async function main() {
  
  try {
    // initialize fee data phase
    let tx = await adminAccount.sendTransaction({
      to: userAccount.address,
      value: ethers.parseEther("1.0"),
      maxFeePerGas: 1000, // initial fee data
      maxPriorityFeePerGas: 1000,
    });
    await tx.wait();
    // retrieve fee data is maxFeePerGas, maxPriorityFeePerGas not zero
    console.log(await provider.getFeeData());
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;

    // initialize owner phase
    tx = await addressRegistry.initializeOwner(adminAccount.address);
    await tx.wait();
    tx = await revenueRatioContract.initializeOwner(adminAccount.address);
    await tx.wait();
    tx = await treasuryRegistryContract.initializeOwner(adminAccount.address);
    await tx.wait();

    // set initial data phase.
    tx = await addressRegistry.addToRegistry(
      userAccount.address,
      initiatorAccount.address
    );
    await tx.wait();

    console.log(
      "contain user:",
      await addressRegistry.contains(userAccount.address)
    );
    console.log(
      "initiator of user:",
      await addressRegistry.discovery(userAccount.address)
    );

    tx = await treasuryRegistryContract.setTreasury(
      "0x000000000000000000000000000000000000dead"
    );
    await tx.wait();

    console.log("treasury at:", await treasuryRegistryContract.treasuryAt());
    // ensure fee data is not zero
    console.log(await provider.getFeeData());
    // set ratio
    tx = await revenueRatioContract.setRevenueRatio(0, 50, 25, 25);
    await tx.wait();
    // enable
    tx = await revenueRatioContract.enable();
    await tx.wait();
   
    console.log("revenue ratio status:", await revenueRatioContract.status());

    // deploy contract simple storage phase
    const bytecode =
      "6080604052348015600f57600080fd5b506101508061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220048fd235e62e4e7916badc7f4819b8b55f928dd81b9b12c01a8d13cfacf48f4664736f6c634300081e0033";
    const storageABI = [
      "function store(uint256 num) public",
      "function retrieve() public view returns (uint256)",
    ];

    const factory = new ethers.ContractFactory(
      storageABI,
      bytecode,
      userAccount
    );
    const storage = await factory.deploy();
    await storage.waitForDeployment();

    let storedValue = await storage.retrieve();
    console.log("stored value:", storedValue.toString());
    console.log(
      "initiator balance before user invocation contract:",
      await provider.getBalance(initiatorAccount)
    );

    console.log(
      "treasury balance before user invocation contract:",
      await provider.getBalance(treasuryAccount)
    );

    console.log(
      "consortium balance before user invocation contract:",
      await provider.getBalance(validatorAddress)
    );

    // tx = await storage.store(Math.floor(Math.random() * 1_000_000));
    const tx2 = {
            to: receiverAddress,
            value: parseEther("0.01"), // sending 0.01 ETH
            gasLimit: 10000000,
            gasPrice: gasPrice,
            nonce: await provider.getTransactionCount(wallet.address),
            chainId: await provider.getNetwork().then(net => net.chainId),
        };
    const txResponse = await wallet.sendTransaction(tx2);
    await txResponse.wait();

    // storedValue = await storage.retrieve();
    // console.log("stored value:", storedValue.toString());
    console.log(
      "initiator balance after user invocation contract:",
      await provider.getBalance(initiatorAccount)
    );
    console.log(
      "treasury balance after user invocation contract:",
      await provider.getBalance(treasuryAccount)
    );
    console.log(
      "consortium balance after user invocation contract:",
      await provider.getBalance(validatorAddress)
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

main();