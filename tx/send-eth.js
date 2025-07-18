const { JsonRpcProvider, Wallet, formatEther, parseEther } = require("ethers");

// Replace with your local node's RPC URL
const provider = new JsonRpcProvider("http://127.0.0.1:8545");

// Replace with your wallet's private key
const privateKey = "0x824a4db5d74578087c44b11965c92b0857daf20f3196c05de09d5d4d97dc2d8a";
const wallet = new Wallet(privateKey, provider);

// Replace with actual receiver address
const receiverAddress = "0x5Dc3945c441c733a94B4561743A9c25089416C43";

async function sendTransaction() {
    try {

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const tx = {
        to: receiverAddress,
        value: parseEther("1000"), // sending 0.01 ETH
        gasLimit: 10000000,
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
        const receipt = await txResponse.wait();
        // Wait for the transaction to be mined
        console.log("Transaction hash:", txResponse.hash);
        // console.log("Transaction mined:", receipt.transactionHash);

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
