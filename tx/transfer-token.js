const { JsonRpcProvider, Wallet, Contract } = require("ethers");

// Your wallet private key (sender)
const privateKey = "0x824a4db5d74578087c44b11965c92b0857daf20f3196c05de09d5d4d97dc2d8a";
const TOKEN_CONTRACT_ADDRESS = "0xC41538B6C1A8aF1c8293B608f706d21E82d2eaD4";
const RECIPIENT_ADDRESS = "0x5Dc3945c441c733a94B4561743A9c25089416C43";

const AMOUNT = 100000;

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

  console.log("Sender balance BEFORE:", senderBalanceBefore.toString());
  console.log("Recipient balance BEFORE:", recipientBalanceBefore.toString());

  // submit tx
  const tx = await tokenContract.transfer(RECIPIENT_ADDRESS, AMOUNT);
  // console.log("Transaction Hash:", tx.hash);

  const receipt = await tx.wait();
  // console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Fetch balances AFTER transfer
  const senderBalanceAfter = await tokenContract.balanceOf(wallet.address);
  const recipientBalanceAfter = await tokenContract.balanceOf(RECIPIENT_ADDRESS);

  console.log("Sender balance AFTER:", senderBalanceAfter.toString());
  console.log("Recipient balance AFTER:", recipientBalanceAfter.toString());

}

transferERC20().catch((error) => {
  console.error("Error transferring tokens:", error);
});
