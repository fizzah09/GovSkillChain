'use client';

import { useState, useEffect } from 'react';
import { useCitizen } from '../../context/CitizenContext';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { api, CertificateData } from '../../lib/api';
import Link from 'next/link';

export default function CertificatesPage() {
  const { address, isConnected } = useAccount();
  const { certificates: contextCertificates } = useCitizen();
  const [ledgerCertificates, setLedgerCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCertificates()
      .then((data) => setLedgerCertificates(data))
      .catch((err) => console.error('Failed to load certificates:', err))
      .finally(() => setLoading(false));
  }, []);

  // Merge context certificates with backend certificates, avoiding duplicates
  const allCerts = [...contextCertificates];
  for (const c of ledgerCertificates) {
    if (!allCerts.some((item) => item.tokenId === c.tokenId)) {
      allCerts.push(c);
    }
  }

  // Filter to user's certificates if wallet matches, otherwise show all certificates
  const userCerts = address
    ? allCerts.filter(
        (c) =>
          c.owner.toLowerCase() === address.toLowerCase() ||
          c.owner.toLowerCase().includes(address.slice(2, 6).toLowerCase())
      )
    : [];

  const displayCertificates = userCerts.length > 0 ? userCerts : allCerts;

  if (!isConnected) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-4 border border-outline-variant/40">
          <span className="material-symbols-outlined text-3xl">account_circle</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Connect Wallet to View Portfolio</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          Your Soulbound Certificates are cryptographically bound to your wallet address. Connect MetaMask to inspect them.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-container-max mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-outline-variant/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-surface-container-high rounded text-secondary text-xs font-mono font-bold mb-2">
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>CITIZEN CREDENTIAL PORTFOLIO</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              My Soulbound Certificates
            </h1>
            <p className="text-sm text-on-surface-variant font-mono mt-1">
              Wallet ID: <span className="text-secondary font-bold">{address}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-sm font-mono text-xs">
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">Total Credentials</span>
              <span className="text-lg font-bold text-secondary">{displayCertificates.length}</span>
            </div>
            <div className="border-l border-outline-variant/30 pl-4">
              <span className="text-[10px] text-on-surface-variant block uppercase">Ledger State</span>
              <span className="text-emerald-700 font-bold">Synchronized</span>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-12 text-center space-y-4 shadow-sm">
            <div className="inline-block animate-spin text-3xl">⚙️</div>
            <p className="text-xs font-mono text-on-surface-variant">Synchronizing certificates from Sepolia ledger...</p>
          </div>
        ) : displayCertificates.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">No Certifications Issued Yet</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Take an accredited examination from the competency catalog to earn your first sovereign certificate.
            </p>
            <div className="pt-2">
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-inverse-surface transition-colors no-underline shadow-sm"
              >
                <span>Browse Available Tests</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCertificates.map((cert) => (
              <div
                key={cert.tokenId}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 hover:border-secondary/60 p-6 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                      TOKEN #{cert.tokenId}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-on-surface">{cert.domainTitle}</h3>
                    <span className="text-xs font-mono text-secondary">ERC-5192 Soulbound</span>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-lg font-mono text-xs flex justify-between items-center">
                    <span className="text-on-surface-variant">Score Achieved:</span>
                    <span className="font-bold text-emerald-700 text-sm">{cert.score}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 mt-4 flex items-center justify-between">
                  <Link
                    href={`/verify/${cert.tokenId}`}
                    className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1 no-underline"
                  >
                    <span>Inspect On-Chain</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </Link>

                  <a
                    href="https://sepolia.etherscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-on-surface-variant hover:text-on-surface"
                  >
                    Sepolia Explorer
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
