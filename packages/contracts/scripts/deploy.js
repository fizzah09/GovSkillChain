const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("----------------------------------------------------");
  console.log("Deploying CertificateRegistry to Sepolia testnet...");
  console.log("Deployer wallet address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.warn("\n⚠️ WARNING: Deployer balance is 0 ETH.");
    console.warn("Please get free testnet ETH from https://sepoliafaucet.com or https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
  }

  // 1. Deploy CertificateNFT
  console.log("\n[1/2] Deploying CertificateNFT (ERC-5192 Soulbound)...");
  const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
  const nft = await CertificateNFT.deploy(deployer.address);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("CertificateNFT deployed at:", nftAddress);

  // 2. Deploy CertificateRegistry
  console.log("\n[2/2] Deploying CertificateRegistry...");
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await CertificateRegistry.deploy(
    deployer.address, // Admin
    deployer.address, // Attestor
    nftAddress        // CertificateNFT contract instance
  );
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("CertificateRegistry deployed at:", registryAddress);

  // Grant MINTER_ROLE on NFT to Registry
  console.log("\nGranting MINTER_ROLE on NFT to Registry...");
  const MINTER_ROLE = await nft.MINTER_ROLE();
  const grantTx = await nft.grantRole(MINTER_ROLE, registryAddress);
  await grantTx.wait();
  console.log("MINTER_ROLE granted successfully.");

  // Save deployment metadata to packages/backend/src/config/deployment.json
  const deploymentData = {
    contractAddress: registryAddress,
    nftAddress: nftAddress,
    attestorAddress: deployer.address,
    chainId: 11155111,
    network: "sepolia",
    deployedAt: new Date().toISOString()
  };

  const backendConfigDir = path.join(__dirname, "..", "..", "backend", "src", "config");
  const deploymentPath = path.join(backendConfigDir, "deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2), "utf8");
  console.log("\nSaved deployment details to:", deploymentPath);

  // Export ABI to backend
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "CertificateRegistry.sol",
    "CertificateRegistry.json"
  );
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiDir = path.join(backendConfigDir, "abis");
    if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });
    fs.writeFileSync(
      path.join(abiDir, "CertificateRegistry.json"),
      JSON.stringify(artifact.abi, null, 2),
      "utf8"
    );
    console.log("Exported CertificateRegistry ABI to backend/src/config/abis/CertificateRegistry.json");
  }

  console.log("----------------------------------------------------");
  console.log(" Deployment complete!");
  console.log("View Registry on Etherscan: https://sepolia.etherscan.io/address/" + registryAddress);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
