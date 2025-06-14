const { JsonRpcProvider, Wallet, formatEther, parseEther } = require("ethers");

// Replace with your local node's RPC URL
const provider = new JsonRpcProvider("http://34.124.220.77:8548");

// Replace with your wallet's private key
const privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const wallet = new Wallet(privateKey, provider);

// Replace with actual receiver address
const receiverAddress = "0x5F172FF5348f1102e375e997D0968A856F1a88D8";

async function sendTransaction() {
    try {

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const tx = {
        to: receiverAddress,
        value: parseEther("0.01"), // sending 0.01 ETH
        gasLimit: 21000,
        gasPrice: gasPrice,
        nonce: await provider.getTransactionCount(wallet.address),
        chainId: await provider.getNetwork().then(net => net.chainId),
    };

   
        
        const receiverBalance_before = await provider.getBalance(receiverAddress);
        const senderBalance_before = await provider.getBalance(wallet);
        console.log(
            `Receiver balance before transaction: ${formatEther(receiverBalance_before)} ETH`
        );
        console.log(
            `Sender balance before transaction: ${formatEther(senderBalance_before)} ETH`
        );

        console.log("Sending transaction...");
        const txResponse = await wallet.sendTransaction(tx);
        console.log("Transaction sent:", txResponse.hash);

        // Wait for the transaction to be mined
        const receipt = await txResponse.wait();
        console.log("Transaction mined:", receipt.transactionHash);

        // Fetch and print balance of receiver
        const receiverBalance_after = await provider.getBalance(receiverAddress);
        const senderBalance_after = await provider.getBalance(wallet);
        console.log(
            `Receiver balance after transaction: ${formatEther(receiverBalance_after)} ETH`
        );
        console.log(
            `Sender balance after transaction: ${formatEther(senderBalance_after)} ETH`
        );
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

sendTransaction();
