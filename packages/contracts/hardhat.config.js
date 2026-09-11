require("@nomicfoundation/hardhat-toolbox");
const path = require("path");

// Load .env from contracts directory, backend directory, or root
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "../backend/.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const rawKey =
  process.env.DEPLOYER_PRIVATE_KEY ||
  process.env.ISSUER_PRIVATE_KEY ||
  process.env.ATTESTOR_PRIVATE_KEY ||
  "";

const privateKey = rawKey
  ? rawKey.startsWith("0x")
    ? rawKey
    : `0x${rawKey}`
  : "";

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun"
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || process.env.RPC_URL || "",
      accounts: privateKey ? [privateKey] : [],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};
