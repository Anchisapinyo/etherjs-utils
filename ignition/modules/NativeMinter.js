const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const previousNativeMinter = "0x0000000000000000000000000000000000001001";
const admin = "0x32D5a21376C0dF3F98200a00380b06adeE341B91";

const NativeMinterModule = buildModule("NativeMinterModule", (m) => {
    
    const precompiledAddress = m.getParameter("precompiledAddress", previousNativeMinter);
    const adminAddress = m.getParameter("adminAddress", admin);

  const newNativeminter = m.contract("NativeMinterV2", [precompiledAddress, adminAddress]);

  return { newNativeminter };
});

module.exports = NativeMinterModule;