'use client';

import Link from 'next/link';

interface CertificateCardProps {
  tokenId: string;
  domainTitle: string;
  score: number;
  issuedAt: string;
  isRevoked: boolean;
  owner: string;
  txHash?: string;
  demo?: boolean;
}

export default function CertificateCard({
  tokenId,
  domainTitle,
  score,
  issuedAt,
  isRevoked,
  owner,
  txHash,
  demo,
}: CertificateCardProps) {
  const formattedDate = new Date(issuedAt).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="glass-card overflow-hidden animate-fade-in" style={{ opacity: isRevoked ? 0.5 : 1 }}>
      {/* Header stripe */}
      <div
        className="h-2"
        style={{
          background: isRevoked
            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
            : 'linear-gradient(90deg, #3b82f6, #6366f1, #10b981)',
        }}
      />

      <div className="p-5">
        {/* Status badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="badge badge-blue">Token #{tokenId}</span>
          {isRevoked ? (
            <span className="badge badge-red">REVOKED</span>
          ) : (
            <span className="badge badge-green">VERIFIED</span>
          )}
        </div>

        {/* Domain title */}
        <h3 className="text-lg font-bold text-white mb-1">{domainTitle}</h3>

        {/* Score */}
        <div className="flex items-center gap-2 mb-4">
          <div className="progress-bar flex-1" style={{ maxWidth: 120 }}>
            <div className="progress-fill" style={{ width: `${score}%` }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: score >= 70 ? '#34d399' : '#fbbf24' }}>
            {score}%
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex justify-between">
            <span>Owner</span>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {owner.slice(0, 6)}...{owner.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Issued</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Standard</span>
            <span>ERC-5192 Soulbound</span>
          </div>
          {demo && (
            <div className="flex justify-between">
              <span>Mode</span>
              <span className="badge badge-amber" style={{ fontSize: '0.6rem' }}>DEMO</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="divider" />
        <div className="flex items-center gap-2">
          <Link href={`/verify/${tokenId}`} className="btn-secondary text-xs py-2 px-3 flex-1 text-center">
            Verify On-Chain
          </Link>
          {txHash && !demo && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2 px-3"
              style={{ color: '#94a3b8' }}
            >
              Etherscan ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
