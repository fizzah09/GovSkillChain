'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api, CertificateData } from '../../../lib/api';
import StatusBanner from '../../../components/StatusBanner';
import Link from 'next/link';

export default function VerifyTokenPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.verifyCertificate(tokenId)
      .then(setCert)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tokenId]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4 animate-spin" style={{ display: 'inline-block' }}>⛓️</div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Querying blockchain...</p>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="page-container max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <StatusBanner type="error" message={error || 'Certificate not found'} />
        <Link href="/verify" className="btn-secondary mt-6">← Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl mx-auto animate-fade-in">
      {/* Certificate card */}
      <div className="glass-card overflow-hidden">
        {/* Top stripe */}
        <div className="h-2" style={{
          background: cert.isRevoked
            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
            : 'linear-gradient(90deg, #3b82f6, #6366f1, #10b981)',
        }} />

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">{cert.isRevoked ? '❌' : '🏛️'}</div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {cert.isRevoked ? 'Certificate Revoked' : 'Government Certificate Verified'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ERC-5192 Soulbound Token on Ethereum Sepolia
            </p>
          </div>

          <div className="glass-card p-6 mb-6" style={{ background: 'rgba(15,22,41,0.5)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Token ID</p>
                <p className="font-mono font-bold text-white">#{cert.tokenId}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Score</p>
                <p className="font-bold" style={{ color: cert.score >= 70 ? '#34d399' : '#fbbf24' }}>{cert.score}%</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Domain</p>
                <p className="text-sm font-semibold text-white">{cert.domainTitle}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Status</p>
                <span className={cert.isRevoked ? 'badge badge-red' : 'badge badge-green'}>
                  {cert.isRevoked ? 'REVOKED' : 'VALID'}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Owner</p>
                <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{cert.owner}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Issued</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(cert.issuedAt).toLocaleString('en-PK')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/verify" className="btn-secondary">← Verify Another</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
