const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MyTokenModule = buildModule("MyTokenModule", (m) => {
  const mytoken = m.contract("MyToken");

  return { mytoken };
});

module.exports = MyTokenModule;