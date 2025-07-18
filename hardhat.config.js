require("@nomicfoundation/hardhat-toolbox");
const PRIVATE_KEY = "0x824a4db5d74578087c44b11965c92b0857daf20f3196c05de09d5d4d97dc2d8a";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    local: {
      url: `http://127.0.0.1:8545`,
      accounts: [PRIVATE_KEY],
    },
  },
};