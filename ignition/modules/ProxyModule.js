const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const proxyModule = buildModule("ProxyModule", (m) => {
  const proxyAdminOwner = m.getParameter("admin");

  const vulnerableContract = m.contract("VulnerableContract");

  const proxy = m.contract("TransparentUpgradeableProxy", [
    vulnerableContract,
    proxyAdminOwner,
    m.encodeFunctionCall(vulnerableContract, "initialize", [proxyAdminOwner]),
  ]);

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin"
  );
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  const attackContract = m.contract("AttackContract", [proxy]);

  return { proxyAdmin, proxy, vulnerableContract, attackContract };
});

module.exports = proxyModule;
