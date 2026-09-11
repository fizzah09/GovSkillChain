'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, CertificateData } from '../../lib/api';
import StatusBanner from '../../components/StatusBanner';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const [tokenIdInput, setTokenIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');

  async function handleVerify(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const id = tokenIdInput.trim().replace(/^#/, '');
    if (!id) return;

    setLoading(true);
    setError('');
    setCert(null);

    try {
      const data = await api.verifyCertificate(id);
      setCert(data);
    } catch (err: any) {
      setError(err.message || `No certificate found with Token ID #${id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-background min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verification Hero Masthead */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded text-secondary text-xs font-mono font-bold uppercase">
            <span className="material-symbols-outlined text-sm">fact_check</span>
            <span>PUBLIC SOVEREIGN VERIFICATION PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Verify a Citizen Credential
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Anyone (employers, regulatory bodies, international agencies) can query the Sepolia blockchain ledger to audit authentic skill credentials in real time.
          </p>
        </div>

        {/* Search Bar Input */}
        <form
          onSubmit={handleVerify}
          className="bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-outline-variant/50 shadow-md flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-xl">
              search
            </span>
            <input
              type="text"
              value={tokenIdInput}
              onChange={(e) => setTokenIdInput(e.target.value)}
              placeholder="Enter Certificate Token ID (e.g. 1, 2, 3...)"
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-secondary font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !tokenIdInput.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-inverse-surface transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <span className="animate-spin text-sm">⚙️</span>
                <span>Querying Sepolia...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Audit Credential</span>
              </>
            )}
          </button>
        </form>

        {error && <StatusBanner type="error" message={error} onClose={() => setError('')} />}

        {/* Verification Certificate Sheet */}
        {cert && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-lg p-6 sm:p-8 space-y-6">
            {/* Header with State Crest & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/40 shrink-0">
                  <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg text-on-surface">{cert.domainTitle}</h2>
                  </div>
                  <p className="text-xs text-on-surface-variant font-mono">
                    Official Competency Credential • Token #{cert.tokenId}
                  </p>
                </div>
              </div>

              <div>
                {cert.isRevoked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-xs font-mono font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    REVOKED / INVALID
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    OFFICIALLY VALIDATED
                  </span>
                )}
              </div>
            </div>

            {/* Credential Data Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-surface-container-low rounded-lg font-mono text-xs border border-outline-variant/30">
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase">Candidate Score</span>
                <span className="font-extrabold text-emerald-700 text-base">{cert.score}%</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase">Standard</span>
                <span className="font-bold text-on-surface text-base">ERC-5192 Soulbound</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase">Issuance Date</span>
                <span className="font-bold text-on-surface text-sm">
                  {new Date(cert.issuedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase">Ledger Network</span>
                <span className="font-bold text-secondary text-sm">Sepolia (11155111)</span>
              </div>
            </div>

            {/* Holder Wallet & Cryptographic Hash */}
            <div className="space-y-2 font-mono text-xs text-on-surface-variant">
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/40 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Holder Wallet Address:</span>
                <span className="text-on-surface font-bold break-all">{cert.owner}</span>
              </div>

              <div className="p-3 bg-surface-container-lowest border border-outline-variant/40 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Attestation Anchor:</span>
                <span className="text-secondary font-bold">EIP-712 Government Keyed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <a
                href={`https://sepolia.etherscan.io`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-outline-variant/40 rounded-lg text-xs font-semibold text-secondary hover:bg-surface-container transition-colors inline-flex items-center gap-1 no-underline"
              >
                <span>Audit on Etherscan</span>
                <span className="material-symbols-outlined text-sm">north_east</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
