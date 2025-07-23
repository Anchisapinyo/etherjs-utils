const { JsonRpcProvider, Wallet, formatEther, parseEther, ContractFactory } = require("ethers");
// Replace with your local node's RPC URL
const provider = new JsonRpcProvider("http://127.0.0.1:8545");
// Replace with your wallet's private key
const privateKey = "0x675a20025082dcc11ac621eb70e549f1cddfabb9957b62946418ee84859a86cd";
const wallet = new Wallet(privateKey, provider);
// Replace with actual receiver address
const validator1 = "0x32d5a21376c0df3f98200a00380b06adee341b91";
const validator2 = "0x6f7090364d4aE2C1819693D6382b74C7D004b4B8";
const validator3 = "0x7c55259cc19af2ab5f417680884b5b642e20cdc4";
const receiverAddress = "0x933A29Acf3D8b4BBb8bf619E866C21984F1EaBD8";
const treasury = "0x5B8C9F15bF96541978782ACa58908d260924BF85"; 
const serviceProvider = "0xAbE6CBd690685Bff226E1E4230B72757d37505b4"; 

async function sendTransaction() {
    try {

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const tx = {
        to: receiverAddress,
        value: parseEther("0.01"), // sending 0.01 ETH
        gasLimit: 10000000,
        gasPrice: gasPrice,
        nonce: await provider.getTransactionCount(wallet.address),
        chainId: await provider.getNetwork().then(net => net.chainId),
    };

        const receiverBalance_before = await provider.getBalance(receiverAddress);
        const senderBalance_before = await provider.getBalance(wallet);
        const validator1_Balance_before = await provider.getBalance(validator1);
        const validator2_Balance_before = await provider.getBalance(validator2);
        const validator3_Balance_before = await provider.getBalance(validator3);
        const serviceProvider_Balance_before = await provider.getBalance(serviceProvider);
        const treasury_Balance_before = await provider.getBalance(treasury);
        console.log("---------------------------------Before sending native------------------------------------------");
        console.log(
            `Receiver balance before transaction: ${formatEther(receiverBalance_before)} ETH`
        );
        console.log(
            `Sender balance before transaction: ${formatEther(senderBalance_before)} ETH`
        );

        console.log("Sending transaction...");
        const txResponse = await wallet.sendTransaction(tx);
        const receipt = await txResponse.wait();
        // Wait for the transaction to be mined

        console.log("---------------------------------After sending native------------------------------------------");
        console.log("Transaction hash:", txResponse.hash);
        // console.log("Transaction mined:", receipt.transactionHash);

        // Fetch and print balance of receiver
        const receiverBalance_after = await provider.getBalance(receiverAddress);
        const senderBalance_after = await provider.getBalance(wallet);
        const validator1_Balance_after = await provider.getBalance(validator1);
        const validator2_Balance_after = await provider.getBalance(validator2);
        const validator3_Balance_after = await provider.getBalance(validator3);
        const serviceProvider_Balance_after = await provider.getBalance(serviceProvider);
        const treasury_Balance_after = await provider.getBalance(treasury);

        console.log(
            `Receiver balance after transaction: ${formatEther(receiverBalance_after)} ETH`
        );
        console.log(
            `Sender balance after transaction: ${formatEther(senderBalance_after)} ETH`
        );
        console.log("---------------------------------Gas calculation----------------------------------");

        console.log(`validator1 gas_recieved: ${(validator1_Balance_after - validator1_Balance_before)} wei`);
        console.log(`validator2 gas_recieved: ${(validator2_Balance_after - validator2_Balance_before)} wei`);
        console.log(`validator3 gas_recieved: ${(validator3_Balance_after - validator3_Balance_before)} wei`);
        console.log(`treasury gas_recieved: ${(treasury_Balance_after - treasury_Balance_before)} wei`);
        console.log(`sender gas_recieved: ${(senderBalance_after - senderBalance_before + BigInt(10000000000000000))} wei`);
        console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after - serviceProvider_Balance_before)} wei`);
        console.log(`consortium gas_recieved: ${(0)} wei`);

        const bytecode =
              "6080604052348015600f57600080fd5b506101508061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220048fd235e62e4e7916badc7f4819b8b55f928dd81b9b12c01a8d13cfacf48f4664736f6c634300081e0033";
            const storageABI = [
              "function store(uint256 num) public",
              "function retrieve() public view returns (uint256)",
            ];
        
            const factory = new ContractFactory(
              storageABI,
              bytecode,
              wallet
            );
            const storage = await factory.deploy();
            console.log("Deploying Simple Storage...");
            await storage.waitForDeployment();
        
            let storedValue = await storage.retrieve();
            console.log("stored value:", storedValue.toString());

            const receiverBalance_before2 = await provider.getBalance(receiverAddress);
            const senderBalance_before2 = await provider.getBalance(wallet);
            const validator1_Balance_before2 = await provider.getBalance(validator1);
            const validator2_Balance_before2 = await provider.getBalance(validator2);
            const validator3_Balance_before2 = await provider.getBalance(validator3);
            const serviceProvider_Balance_before2 = await provider.getBalance(serviceProvider);
            const treasury_Balance_before2 = await provider.getBalance(treasury);
            
    const tx2 = await storage.store(Math.floor(123));
    await tx2.wait();

    const newStoredValue = await storage.retrieve();
    console.log("stored new value:", newStoredValue.toString());

            const receiverBalance_after2 = await provider.getBalance(receiverAddress);
            const senderBalance_after2 = await provider.getBalance(wallet);
            const validator1_Balance_after2 = await provider.getBalance(validator1);
            const validator2_Balance_after2 = await provider.getBalance(validator2);
            const validator3_Balance_after2 = await provider.getBalance(validator3);
            const serviceProvider_Balance_after2 = await provider.getBalance(serviceProvider);
            const treasury_Balance_after2 = await provider.getBalance(treasury);
    
            console.log("---------------------------------Gas calculation----------------------------------");
            console.log(`validator1 gas_recieved: ${(validator1_Balance_after2 - validator1_Balance_before2)} wei`);
            console.log(`validator2 gas_recieved: ${(validator2_Balance_after2 - validator2_Balance_before2)} wei`);
            console.log(`validator3 gas_recieved: ${(validator3_Balance_after2 - validator3_Balance_before2)} wei`);
            console.log(`treasury gas_recieved: ${(treasury_Balance_after2 - treasury_Balance_before2)} wei`);
            console.log(`sender gas_recieved: ${(senderBalance_after2 - senderBalance_before2)} wei`);
            console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after2 - serviceProvider_Balance_before2)} wei`);
            console.log(`consortium gas_recieved: ${(0)} wei`);

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

sendTransaction();
