import { contract, DEMO_MODE } from '../config/blockchain.config';
import { GradingResult } from './grading.service';
import { getDomainById } from '../data/questionBank';

export interface MintResult {
  tokenId: string;
  txHash: string;
  demo: boolean;
}

export interface CertificateData {
  tokenId: string;
  owner: string;
  domainId: string;
  domainTitle: string;
  score: number;
  issuedAt: string;
  isRevoked: boolean;
  revokedReason?: string;
  demo: boolean;
}

// In-memory registry with initial realistic state records matching Stitch administrative feed
const demoRegistry = new Map<
  string,
  {
    owner: string;
    domainId: string;
    score: number;
    issuedAt: string;
    isRevoked: boolean;
    revokedReason?: string;
  }
>([
  [
    '4829',
    {
      owner: '0x71C...49A2',
      domainId: 'civic-law',
      score: 85,
      issuedAt: '2024-10-24T14:22:00Z',
      isRevoked: false,
    },
  ],
  [
    '4828',
    {
      owner: '0x93B...12FA',
      domainId: 'digital-governance',
      score: 78,
      issuedAt: '2024-10-23T10:15:00Z',
      isRevoked: false,
    },
  ],
  [
    '4827',
    {
      owner: '0x44E...99C1',
      domainId: 'public-finance',
      score: 92,
      issuedAt: '2024-10-22T08:30:00Z',
      isRevoked: true,
      revokedReason: 'Academic Misconduct / Examination Fraud',
    },
  ],
]);

let demoTokenCounter = 4830;

export async function listAllCertificates(): Promise<CertificateData[]> {
  const list: CertificateData[] = [];
  for (const [tokenId, item] of demoRegistry.entries()) {
    const domain = getDomainById(item.domainId);
    list.push({
      tokenId,
      owner: item.owner,
      domainId: item.domainId,
      domainTitle: domain?.title ?? item.domainId,
      score: item.score,
      issuedAt: item.issuedAt,
      isRevoked: item.isRevoked,
      revokedReason: item.revokedReason,
      demo: DEMO_MODE || !contract,
    });
  }
  // Sort descending by token id
  return list.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
}

export async function mintCertificate(result: GradingResult): Promise<MintResult> {
  const domain = getDomainById(result.domainId);
  const domainTitle = domain?.title ?? result.domainId;

  const metadata = {
    name: `GovSkill Certificate — ${domainTitle}`,
    description: `Soulbound certification issued to ${result.walletAddress} for passing the ${domainTitle} competency assessment.`,
    attributes: [
      { trait_type: 'Domain', value: domainTitle },
      { trait_type: 'Score', value: result.score },
      { trait_type: 'Passing Score', value: result.passingScore },
      { trait_type: 'Issued At', value: result.answeredAt },
      { trait_type: 'Network', value: 'Sepolia' },
      { trait_type: 'Standard', value: 'ERC-5192 Soulbound' },
    ],
    external_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify`,
  };

  const tokenURI = `data:application/json;base64,${Buffer.from(
    JSON.stringify(metadata)
  ).toString('base64')}`;

  if (DEMO_MODE || !contract) {
    const tokenId = String(demoTokenCounter++);
    const txHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    demoRegistry.set(tokenId, {
      owner: result.walletAddress,
      domainId: result.domainId,
      score: result.score,
      issuedAt: result.answeredAt,
      isRevoked: false,
    });

    console.log(`[Blockchain/DEMO] Minted token #${tokenId} to ${result.walletAddress}`);
    return { tokenId, txHash, demo: true };
  }

  // Live on-chain minting
  try {
    const tx = await contract['mint'](result.walletAddress, tokenURI);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log: unknown) => {
        try {
          return contract!.interface.parseLog(log as { topics: string[]; data: string });
        } catch {
          return null;
        }
      })
      .find((e: { name: string } | null) => e?.name === 'CertificateMinted');

    const tokenId = event ? String(event.args.tokenId) : String(receipt.blockNumber);

    demoRegistry.set(tokenId, {
      owner: result.walletAddress,
      domainId: result.domainId,
      score: result.score,
      issuedAt: result.answeredAt,
      isRevoked: false,
    });

    console.log(`[Blockchain] Minted token #${tokenId} tx: ${receipt.hash}`);
    return { tokenId, txHash: receipt.hash, demo: false };
  } catch (err) {
    console.error('[Blockchain] Mint failed:', err);
    throw new Error('Failed to mint certificate on-chain');
  }
}

export async function verifyCertificate(tokenId: string): Promise<CertificateData | null> {
  const cached = demoRegistry.get(tokenId);

  if (DEMO_MODE || !contract) {
    if (!cached) return null;
    const domain = getDomainById(cached.domainId);
    return {
      tokenId,
      owner: cached.owner,
      domainId: cached.domainId,
      domainTitle: domain?.title ?? cached.domainId,
      score: cached.score,
      issuedAt: cached.issuedAt,
      isRevoked: cached.isRevoked,
      revokedReason: cached.revokedReason,
      demo: true,
    };
  }

  // Live on-chain query
  try {
    const owner: string = await contract['ownerOf'](tokenId);
    const isRevoked: boolean = await contract['isRevoked'](tokenId);

    const domain = cached ? getDomainById(cached.domainId) : null;

    return {
      tokenId,
      owner,
      domainId: cached?.domainId ?? 'unknown',
      domainTitle: domain?.title ?? 'Government Competency',
      score: cached?.score ?? 0,
      issuedAt: cached?.issuedAt ?? new Date().toISOString(),
      isRevoked,
      revokedReason: cached?.revokedReason,
      demo: false,
    };
  } catch {
    return null;
  }
}

export async function revokeCertificate(
  tokenId: string,
  reason: string = 'Administrative Invalidation'
): Promise<{ txHash: string; demo: boolean }> {
  const cached = demoRegistry.get(tokenId);
  if (!cached) throw new Error(`Token #${tokenId} not found`);
  if (cached.isRevoked) throw new Error(`Token #${tokenId} is already revoked`);

  if (DEMO_MODE || !contract) {
    cached.isRevoked = true;
    cached.revokedReason = reason;
    const txHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    console.log(`[Blockchain/DEMO] Revoked token #${tokenId}, reason: ${reason}`);
    return { txHash, demo: true };
  }

  try {
    const tx = await contract['revoke'](tokenId);
    const receipt = await tx.wait();
    cached.isRevoked = true;
    cached.revokedReason = reason;
    return { txHash: receipt.hash, demo: false };
  } catch (err) {
    console.error('[Blockchain] Revoke failed:', err);
    throw new Error('Failed to revoke certificate on-chain');
  }
}
