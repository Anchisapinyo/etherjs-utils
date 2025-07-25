const { ethers, JsonRpcProvider, Wallet, formatEther, parseEther, ContractFactory } = require("ethers");
const { abiTreasuryRegistry } = require("../utils/abis/TreasuryRegistry");
const { abiAddressRegistry } = require("../utils/abis/AddressRegistry");
const { abiRevenueRatio } = require("../utils/abis/RevenueRatio");
const { abiERC20Token } = require("../utils/abis/ERC20Token");
const { Config } = require("../utils/constants");


// Replace with your local node's RPC URL
const provider = new JsonRpcProvider(Config.JSON_RPC_URL);
// Replace with your wallet's private key
const wallet = new Wallet(Config.senderPrivk, provider);
const adminAccount = new Wallet(Config.validator1Privk, provider);
// contract connect to precompile
const treasuryRegistryContract = new ethers.Contract(
  Config.treasuryRegistryContractAddress,
  abiTreasuryRegistry,
  adminAccount);

const addressRegistryContract = new ethers.Contract(
  Config.addressRegistryContractAddress,
  abiAddressRegistry,
  adminAccount
); 
const revenueRatioContract = new ethers.Contract(
  Config.revenueRatioContractAddress,
  abiRevenueRatio,
  adminAccount
);

async function main() {
  
  try {
     // initialize fee data phase
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice;
        let tx = {
          gasLimit: 10000000,
          gasPrice: gasPrice,
          nonce: await provider.getTransactionCount(wallet.address),
          chainId: await provider.getNetwork().then(net => net.chainId),
        };

        // initialize owner phase
        tx = await treasuryRegistryContract.initializeOwner(adminAccount.address);
        await tx.wait();
        tx = await addressRegistryContract.initializeOwner(adminAccount.address);
        await tx.wait();
        tx = await revenueRatioContract.initializeOwner(adminAccount.address);
        await tx.wait();
        console.log("owner treasuryRegistryContract", await treasuryRegistryContract.owner());
        console.log("owner addressRegistryContract", await addressRegistryContract.owner());
        console.log("owner revenueRatioContract", await revenueRatioContract.owner());

        // add treasury
        tx = await treasuryRegistryContract.setTreasury(Config.treasuryAddress);
        await tx.wait();

        console.log("treasury at:", await treasuryRegistryContract.treasuryAt());

        // add address registry (servic provider onboards a merchant)
        tx = await addressRegistryContract.addToRegistry(
        Config.merchantAddress,
        Config.serviceProviderAddress
        );
        await tx.wait();

        console.log(
          "Merchant (account):",
          await addressRegistryContract.contains(Config.merchantAddress)
        );
        console.log(
          "Service provider (initiator):",
          await addressRegistryContract.discovery(Config.merchantAddress)
        );

        // add address registry (merchant adds a whitelist contract)
        tx = await addressRegistryContract.addToRegistry(
        Config.TOKEN_CONTRACT_ADDRESS,
        Config.merchantAddress
        );
        await tx.wait();

        console.log(
          "TOKEN_CONTRACT_ADDRESS (account):",
          await addressRegistryContract.contains(Config.TOKEN_CONTRACT_ADDRESS)
        );
        console.log(
          "Merchant address (initiator):",
          await addressRegistryContract.discovery(Config.TOKEN_CONTRACT_ADDRESS)
        );


        // Before enable gas distribution
        console.log("------------------------Before enable gas distribution--------------------------");

        const senderBalance_before = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_before = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_before = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_before = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_before = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_before = await provider.getBalance(Config.treasuryAddress);
        
        let nativetx = {
          to: Config.receiverAddress,
          value: parseEther("0.01"), // sending 0.01 ETH
          gasLimit: 10000000,
          gasPrice: gasPrice,
          nonce: await provider.getTransactionCount(wallet.address),
          chainId: await provider.getNetwork().then(net => net.chainId),
        };
        let txResponse = await wallet.sendTransaction(nativetx);
        console.log("Sending native...");
        await txResponse.wait();
        
        const senderBalance_after = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_after = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_after = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_after = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_after = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_after = await provider.getBalance(Config.treasuryAddress);

        console.log("-------------------Gas calculation (P2P before enable gas distribution)-------------------");

        console.log(`validator1 gas_recieved: ${(validator1_Balance_after - validator1_Balance_before)} wei`);
        console.log(`validator2 gas_recieved: ${(validator2_Balance_after - validator2_Balance_before)} wei`);
        console.log(`validator3 gas_recieved: ${(validator3_Balance_after - validator3_Balance_before)} wei`);
        console.log(`treasury gas_recieved: ${(treasury_Balance_after - treasury_Balance_before)} wei`);
        console.log(`sender gas_recieved: ${(senderBalance_after - senderBalance_before + BigInt(10000000000000000))} wei`);
        console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after - serviceProvider_Balance_before)} wei`);
        console.log(`consortium gas_recieved: ${(0)} wei`);

        // After enable gas distribution
        console.log("------------------------After enable gas distribution--------------------------");
        
        // set revenue ratio
        tx = await revenueRatioContract.setRevenueRatio(20, 30, 25, 25); // contract, coinbase, provider, treasury
        await tx.wait();
        // enable
        tx = await revenueRatioContract.enable();
        await tx.wait();
        console.log("revenue ratio setting: contractRatio, coinbaseRatio, providerRatio, treasuryRatio", await revenueRatioContract.contractRatio(), await revenueRatioContract.coinbaseRatio(), await revenueRatioContract.providerRatio(), await revenueRatioContract.treasuryRatio());
        console.log("revenue ratio status:", await revenueRatioContract.status());

        const senderBalance_before2 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_before2 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_before2 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_before2 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_before2 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_before2 = await provider.getBalance(Config.treasuryAddress);
      
         nativetx = {
          to: Config.receiverAddress,
          value: parseEther("0.01"), // sending 0.01 ETH
          gasLimit: 10000000,
          gasPrice: gasPrice,
          nonce: await provider.getTransactionCount(wallet.address),
          chainId: await provider.getNetwork().then(net => net.chainId),
        };
        txResponse = await wallet.sendTransaction(nativetx);
        console.log("Sending native...");
        await txResponse.wait();
        
        const senderBalance_after2 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_after2 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_after2 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_after2 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_after2 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_after2 = await provider.getBalance(Config.treasuryAddress);

        console.log("-------------------Gas calculation (P2P after enable gas distribution)---------------------");

        console.log(`validator1 gas_recieved: ${(validator1_Balance_after2 - validator1_Balance_before2)} wei`);
        console.log(`validator2 gas_recieved: ${(validator2_Balance_after2 - validator2_Balance_before2)} wei`);
        console.log(`validator3 gas_recieved: ${(validator3_Balance_after2 - validator3_Balance_before2)} wei`);
        console.log(`treasury gas_recieved: ${(treasury_Balance_after2 - treasury_Balance_before2)} wei`);
        console.log(`sender gas_recieved: ${(senderBalance_after2 - senderBalance_before2 + BigInt(10000000000000000))} wei`);
        console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after2 - serviceProvider_Balance_before2)} wei`);
        console.log(`consortium gas_recieved: ${(0)} wei`);

         // contract creation
        console.log("------------------------Gas Distribution After Contract Creation--------------------------");

        const senderBalance_before3 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_before3 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_before3 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_before3 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_before3 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_before3 = await provider.getBalance(Config.treasuryAddress);
        
        const bytecode =
                      "6080604052348015600f57600080fd5b506101508061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220048fd235e62e4e7916badc7f4819b8b55f928dd81b9b12c01a8d13cfacf48f4664736f6c634300081e0033";
        const storageABI = [
                      "function store(uint256 num) public",
                      "function retrieve() public view returns (uint256)",];
                
        const factory = new ContractFactory(
                      storageABI,
                      bytecode,
                      wallet);
        
        const storage = await factory.deploy();
        console.log("Deploying Simple Storage...");
        await storage.waitForDeployment();
        
        const senderBalance_after3 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_after3 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_after3 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_after3 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_after3 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_after3 = await provider.getBalance(Config.treasuryAddress);

        console.log("-------------------Gas calculation (Gas Distribution After Contract Creation)---------------------");

        console.log(`validator1 gas_recieved: ${(validator1_Balance_after3 - validator1_Balance_before3)} wei`);
        console.log(`validator2 gas_recieved: ${(validator2_Balance_after3 - validator2_Balance_before3)} wei`);
        console.log(`validator3 gas_recieved: ${(validator3_Balance_after3 - validator3_Balance_before3)} wei`);
        console.log(`treasury gas_recieved: ${(treasury_Balance_after3 - treasury_Balance_before3)} wei`);
        console.log(`sender gas_recieved: ${(senderBalance_after3 - senderBalance_before3)} wei`);
        console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after3 - serviceProvider_Balance_before3)} wei`);
        console.log(`consortium gas_recieved: ${(0)} wei`);

       // ERC-20 contract interaction (a whitelisted contract)
      console.log("------------------------Gas Distribution After ERC-20 token contract interaction (a whitelisted contract) --------------------------");
        const senderBalance_before4 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_before4 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_before4 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_before4 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_before4 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_before4 = await provider.getBalance(Config.treasuryAddress);
        
        // interaction 
        const tokenContract = new ethers.Contract(
            Config.TOKEN_CONTRACT_ADDRESS,
            abiERC20Token,
            wallet
          );
        tx = await tokenContract.transfer(Config.receiverAddress, 1);
        console.log("Sending ERC20...");
        await tx.wait();

        const senderBalance_after4 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_after4 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_after4 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_after4 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_after4 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_after4 = await provider.getBalance(Config.treasuryAddress);

        console.log("-------------------Gas calculation (Gas Distribution After ERC-20 token contract interaction - a whitelisted contract)---------------------");

        console.log(`validator1 gas_recieved: ${(validator1_Balance_after4 - validator1_Balance_before4)} wei`);
        console.log(`validator2 gas_recieved: ${(validator2_Balance_after4 - validator2_Balance_before4)} wei`);
        console.log(`validator3 gas_recieved: ${(validator3_Balance_after4 - validator3_Balance_before4)} wei`);
        console.log(`treasury gas_recieved: ${(treasury_Balance_after4 - treasury_Balance_before4)} wei`);
        console.log(`sender gas_recieved: ${(senderBalance_after4 - senderBalance_before4)} wei`);
        console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after4 - serviceProvider_Balance_before4)} wei`);
        console.log(`consortium gas_recieved: ${(0)} wei`);
       
        // Simple storage contract interaction (a non-whitelisted contract)
        console.log("------------------------Gas Distribution After interacting the Simple storage contract (a non-whitelisted contract) --------------------------");

        const senderBalance_before5 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_before5 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_before5 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_before5 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_before5 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_before5 = await provider.getBalance(Config.treasuryAddress);
        
        // interaction 
        // interaction 
        const tokenContract2 = new ethers.Contract(
            Config.NON_WHITELISTED_CONTRACT_ADDRESS,
            abiERC20Token,
            wallet
          );
        tx = await tokenContract2.transfer(Config.receiverAddress, 1);
        console.log("Sending ERC20...");
        await tx.wait();

        const senderBalance_after5 = await provider.getBalance(Config.senderAddress);
        const validator1_Balance_after5 = await provider.getBalance(Config.validator1Address);
        const validator2_Balance_after5 = await provider.getBalance(Config.validator2Address);
        const validator3_Balance_after5 = await provider.getBalance(Config.validator3Address);
        const serviceProvider_Balance_after5 = await provider.getBalance(Config.serviceProviderAddress);
        const treasury_Balance_after5 = await provider.getBalance(Config.treasuryAddress);

        console.log("-------------------Gas calculation (Gas Distribution After interacting the Simple storage contract - a non-whitelisted contract)---------------------");

        console.log(`validator1 gas_recieved: ${(validator1_Balance_after5 - validator1_Balance_before5)} wei`);
        console.log(`validator2 gas_recieved: ${(validator2_Balance_after5 - validator2_Balance_before5)} wei`);
        console.log(`validator3 gas_recieved: ${(validator3_Balance_after5 - validator3_Balance_before5)} wei`);
        console.log(`treasury gas_recieved: ${(treasury_Balance_after5 - treasury_Balance_before5)} wei`);
        console.log(`sender gas_recieved: ${(senderBalance_after5 - senderBalance_before5)} wei`);
        console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after5 - serviceProvider_Balance_before5)} wei`);
        console.log(`consortium gas_recieved: ${(0)} wei`);

  } catch (error) {
    console.error("Error:", error);
  }

};

main()



