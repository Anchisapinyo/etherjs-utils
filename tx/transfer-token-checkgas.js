const { JsonRpcProvider, Wallet, Contract } = require("ethers");

// Your wallet private key (sender)
const privateKey = "0x675a20025082dcc11ac621eb70e549f1cddfabb9957b62946418ee84859a86cd";
const TOKEN_CONTRACT_ADDRESS = "0xC41538B6C1A8aF1c8293B608f706d21E82d2eaD4";
const RECIPIENT_ADDRESS = "0x933A29Acf3D8b4BBb8bf619E866C21984F1EaBD8";
// Replace with actual receiver address
const validator1 = "0x32d5a21376c0df3f98200a00380b06adee341b91";
const validator2 = "0x6f7090364d4aE2C1819693D6382b74C7D004b4B8";
const validator3 = "0x7c55259cc19af2ab5f417680884b5b642e20cdc4";
const receiverAddress = "0x933A29Acf3D8b4BBb8bf619E866C21984F1EaBD8";
const treasury = "0x5B8C9F15bF96541978782ACa58908d260924BF85"; 
const serviceProvider = "0xAbE6CBd690685Bff226E1E4230B72757d37505b4"; 


const AMOUNT = 1;

const TOKEN_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

async function transferERC20() {

  const provider = new JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new Wallet(privateKey, provider);
  const tokenContract = new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_ABI,
    wallet
  );

  // Fetch balances BEFORE transfer
  const senderBalanceBefore = await tokenContract.balanceOf(wallet.address);
  const recipientBalanceBefore = await tokenContract.balanceOf(RECIPIENT_ADDRESS);

  const senderBalance_before = await provider.getBalance(wallet);
  const validator1_Balance_before = await provider.getBalance(validator1);
  const validator2_Balance_before = await provider.getBalance(validator2);
  const validator3_Balance_before = await provider.getBalance(validator3);
  const serviceProvider_Balance_before = await provider.getBalance(serviceProvider);
  const treasury_Balance_before = await provider.getBalance(treasury);

  console.log("---------------------------------Before sending ERC-20 tokens------------------------------------------");
  console.log(`Sender balance BEFORE:", ${senderBalanceBefore.toString()} Tokens`);
  console.log(`Recipient balance BEFORE:", ${recipientBalanceBefore.toString()} Tokens`);

  // submit tx
  const tx = await tokenContract.transfer(RECIPIENT_ADDRESS, AMOUNT);
  // console.log("Transaction Hash:", tx.hash);
  console.log("Sending transaction...");
  const receipt = await tx.wait();
  // console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Fetch balances AFTER transfer
  const senderBalanceAfter = await tokenContract.balanceOf(wallet.address);
  const recipientBalanceAfter = await tokenContract.balanceOf(RECIPIENT_ADDRESS);

  const senderBalance_after = await provider.getBalance(wallet);
  const validator1_Balance_after = await provider.getBalance(validator1);
  const validator2_Balance_after = await provider.getBalance(validator2);
  const validator3_Balance_after = await provider.getBalance(validator3);
  const serviceProvider_Balance_after = await provider.getBalance(serviceProvider);
  const treasury_Balance_after = await provider.getBalance(treasury);

  console.log("---------------------------------After sending ERC-20 tokens------------------------------------------");
  console.log(`Sender balance AFTER:, ${senderBalanceAfter.toString()} Tokens`);
  console.log(`Recipient balance AFTER:, ${recipientBalanceAfter.toString()} Tokens`);

  console.log("---------------------------------Gas calculation----------------------------------");

  console.log(`validator1 gas_recieved: ${(validator1_Balance_after - validator1_Balance_before)} wei`);
  console.log(`validator2 gas_recieved: ${(validator2_Balance_after - validator2_Balance_before)} wei`);
  console.log(`validator3 gas_recieved: ${(validator3_Balance_after - validator3_Balance_before)} wei`);
  console.log(`treasury gas_recieved: ${(treasury_Balance_after - treasury_Balance_before)} wei`);
  console.log(`sender gas_recieved: ${(senderBalance_after - senderBalance_before)} wei`);
  console.log(`serviceProvider gas_recieved: ${(serviceProvider_Balance_after - serviceProvider_Balance_before)} wei`);
  console.log(`consortium gas_recieved: ${(0)} wei`);







}

transferERC20().catch((error) => {
  console.error("Error transferring tokens:", error);
});
