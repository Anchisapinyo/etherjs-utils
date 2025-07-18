const { JsonRpcProvider, Wallet, formatEther, parseEther } = require("ethers");
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

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

sendTransaction();
