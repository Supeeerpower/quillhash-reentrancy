require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

const dotenv = require("dotenv");
const { HardhatUserConfig } = require("hardhat/config");
dotenv.config();
const { PRIVATE_KEY, NETWORK } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      viaIR: false,
      optimizer: {
        enabled: true,
        runs: 500,
      },
    },
  },
  mocha: {
    timeout: 3600000,
  },
  defaultNetwork: NETWORK,
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    "polygon-amoy": {
      url: "https://polygon-amoy-bor-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      "polygon-amoy": process.env.POLYGONSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "polygon-amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/",
        },
      },
    ],
  },
};
module.exports = config;
