const { JsonRpcProvider, Wallet, formatEther, parseEther } = require("ethers");

// Replace with your local node's RPC URL
const provider = new JsonRpcProvider("http://127.0.0.1:8545");

// address
const treasury = "0x5B8C9F15bF96541978782ACa58908d260924BF85"; // carbon fund
const merchant = "0x27DcEbFC4C6EBecB38b97104D8579D37F627cAaE"; // account
const serviceProvider = "0xAbE6CBd690685Bff226E1E4230B72757d37505b4"; // initiator
const validator1 = "0x32d5a21376c0df3f98200a00380b06adee341b91";
const validator2 = "0x6f7090364d4aE2C1819693D6382b74C7D004b4B8";
const validator3 = "0x7c55259cc19af2ab5f417680884b5b642e20cdc4";
const sender = "0x5Dc3945c441c733a94B4561743A9c25089416C43";
const reciever = "0x933A29Acf3D8b4BBb8bf619E866C21984F1EaBD8"; 


async function checkBalance() {
    
        const serviceProvider_Balance = await provider.getBalance(serviceProvider);
        const merchant_Balance = await provider.getBalance(merchant);
        const treasury_Balance = await provider.getBalance(treasury);
        const validator1_Balance = await provider.getBalance(validator1);
        const validator2_Balance = await provider.getBalance(validator2);
        const validator3_Balance = await provider.getBalance(validator3);
        const sender_Balance = await provider.getBalance(sender);
        const reciever_Balance = await provider.getBalance(reciever);

        console.log(`serviceProvider balance: ${(serviceProvider_Balance)} wei`);
        console.log(`merchant balance: ${(merchant_Balance)} wei`);
        console.log(`treasury balance: ${(treasury_Balance)} wei`);
        console.log(`validator1 balance: ${(validator1_Balance)} wei`);
        console.log(`validator2 balance: ${(validator2_Balance)} wei`);
        console.log(`validator3 balance: ${(validator3_Balance)} wei`);
        console.log(`sender balance: ${(sender_Balance)} wei`);
        console.log(`reciever balance: ${(reciever_Balance)} wei`);
        
}

checkBalance();