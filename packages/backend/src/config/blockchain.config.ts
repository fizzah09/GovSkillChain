import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import deployment from './deployment.json';
import abi from './abis/CertificateRegistry.json';

dotenv.config();

const RPC_URL = process.env.RPC_URL || '';
export const ATTESTOR_PRIVATE_KEY = process.env.ATTESTOR_PRIVATE_KEY || '';
export const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY || '';
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || deployment.contractAddress;

// Format private key helper ensuring 0x prefix
function formatPrivateKey(key: string): string {
  if (!key) return '';
  return key.startsWith('0x') ? key : `0x${key}`;
}

export const DEMO_MODE =
  !ISSUER_PRIVATE_KEY ||
  ISSUER_PRIVATE_KEY === '0x_YOUR_GOVERNMENT_ISSUER_PRIVATE_KEY' ||
  !CONTRACT_ADDRESS ||
  CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000';

export let provider: ethers.JsonRpcProvider | null = null;
export let signer: ethers.Wallet | null = null;
export let attestorSigner: ethers.Wallet | null = null;
export let contract: ethers.Contract | null = null;

if (!DEMO_MODE) {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);

    // Issuer signer for submitting on-chain transactions
    const issuerKey = formatPrivateKey(ISSUER_PRIVATE_KEY);
    signer = new ethers.Wallet(issuerKey, provider);

    // Attestor signer for EIP-712 off-chain attestation signing
    if (ATTESTOR_PRIVATE_KEY) {
      const attestorKey = formatPrivateKey(ATTESTOR_PRIVATE_KEY);
      attestorSigner = new ethers.Wallet(attestorKey, provider);
    } else {
      attestorSigner = signer;
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    console.log('[Blockchain] Connected — Sepolia contract:', CONTRACT_ADDRESS);
    console.log('[Blockchain] Issuer wallet address:', signer.address);
    if (attestorSigner) {
      console.log('[Blockchain] Attestor wallet address:', attestorSigner.address);
    }
  } catch (err) {
    console.error('[Blockchain] Init failed, falling back to DEMO MODE:', err);
  }
} else {
  console.log('[Blockchain] DEMO MODE — blockchain transactions will be simulated.');
  console.log('[Blockchain] To enable live Sepolia mode, set CONTRACT_ADDRESS in packages/backend/.env');
}

export const CONTRACT_ABI = abi;
export { deployment };
