# Workflow: Deploy Contracts to Sepolia

Trigger phrase: "redeploy contracts" or "/deploy-contracts"

Steps:
1. cd packages/contracts
2. Confirm `.env` has SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY set — if missing, STOP and ask
   the user to provide them (never proceed with placeholder keys)
3. npx hardhat compile
4. npx hardhat test  — must pass before continuing
5. npx hardhat run scripts/deploy.js --network sepolia
6. Confirm the script wrote packages/backend/src/config/deployment.json with the new addresses
7. Report the new contract addresses and Etherscan links to the user
8. Remind the user to restart the backend so it picks up the new deployment.json
