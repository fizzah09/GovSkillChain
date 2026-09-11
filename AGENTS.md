# GovSkill Chain — Agent Instructions

## What this project is
Government skill-certification platform. Citizens take a test, get graded, and receive a
soulbound (non-transferable) certificate NFT minted on Ethereum Sepolia testnet. Anyone can
publicly verify a certificate on-chain.

## Network — READ THIS FIRST
- **Target network is Ethereum Sepolia testnet ONLY.** Chain ID 11155111.
- NEVER suggest deploying to Ethereum mainnet or any network requiring real funds.
- NEVER hardcode or invent private keys. All secrets come from `.env` files (gitignored).
- The current deployed contract addresses live in `packages/backend/src/config/deployment.json`
  — treat this file as source of truth; don't assume localhost addresses.

## Package layout
- `packages/contracts` — Solidity contracts, Hardhat config, deploy scripts, tests
- `packages/backend` — Express API (test engine, EIP-712 attestation signing, blockchain bridge)
- `packages/frontend` — Next.js app (citizen + public verification UI)

## Conventions
- Contracts: Solidity 0.8.24, OpenZeppelin 5.x, EVM version `cancun`
- Backend: CommonJS, Ethers.js v6, Express
- Frontend: TypeScript, Next.js App Router, Tailwind, wagmi + RainbowKit for wallet connection
- Never modify `packages/backend/src/config/abis/*.json` by hand — regenerate via
  `packages/contracts` compile + export script after any contract change

## Before making contract changes
Run the existing test suite (`npm test --workspace=packages/contracts`) and confirm passing
before and after any edit. If a change affects the ABI, regenerate and redeploy per the
`deploy-contracts` workflow, then update `deployment.json`.

## Before making backend/frontend changes
Check `packages/backend/src/routes/*.js` for the exact request/response shape before wiring
frontend calls — don't guess the API contract.
