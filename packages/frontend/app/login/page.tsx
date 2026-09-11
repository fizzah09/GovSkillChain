'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useCitizen } from '../../context/CitizenContext';

export default function LoginPage() {
  const { isConnected, address } = useAccount();
  const { citizenId, setCitizenId, citizenName, setCitizenName, setIdentityVerified } = useCitizen();
  const router = useRouter();

  const [idInput, setIdInput] = useState(citizenId || '');
  const [nameInput, setNameInput] = useState(citizenName || '');
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (citizenId) setIdInput(citizenId);
    if (citizenName) setNameInput(citizenName);
  }, [citizenId, citizenName]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!idInput.trim()) {
      setError('Please enter your official National Identity Number (CNIC / Passport).');
      return;
    }

    if (!nameInput.trim()) {
      setError('Please enter your full legal name as per national records.');
      return;
    }

    if (!isConnected) {
      setError('Please connect your Web3 wallet (MetaMask, Coinbase, etc.) to complete attestation.');
      return;
    }

    // Save into Context and localStorage
    setCitizenId(idInput.trim());
    setCitizenName(nameInput.trim());
    setIdentityVerified(true);
    setIsSaved(true);

    // Smooth redirect
    setTimeout(() => {
      router.push('/tests');
    }, 600);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-surface-container-lowest rounded-2xl shadow-xl p-8 sm:p-10 border border-outline-variant/30 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container text-on-primary mb-2 shadow-sm">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Citizen Identity Onboarding
          </h1>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Pair your National Civic Identity Record with your Cryptographic Wallet to take certified skill examinations.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{error}</span>
          </div>
        )}

        {isSaved && (
          <div className="p-4 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-emerald-600">check_circle</span>
            <span>Identity paired successfully! Navigating to competency examination portal...</span>
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Step 1: Legal Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-on-surface-variant uppercase tracking-wider">
              1. Full Legal Name <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Dr. Ayesha Malik"
                className="w-full px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm pl-11"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-on-surface-variant text-lg">
                person
              </span>
            </div>
          </div>

          {/* Step 2: National ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-on-surface-variant uppercase tracking-wider">
              2. National ID / CNIC / Passport <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                placeholder="e.g. 42101-9823412-1"
                className="w-full px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/40 text-on-surface font-mono placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm pl-11"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-on-surface-variant text-lg">
                fingerprint
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs text-secondary">lock</span>
              <span>Zero-Knowledge Cloaked: Never stored in plaintext on public blockchain.</span>
            </p>
          </div>

          {/* Step 3: Web3 Wallet */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/20">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold font-mono text-on-surface-variant uppercase tracking-wider">
                3. Web3 Sovereign Wallet <span className="text-error">*</span>
              </label>
              {isConnected && (
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Connected
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-mono font-bold text-on-surface">
                    {isConnected && address
                      ? `${address.slice(0, 8)}...${address.slice(-6)}`
                      : 'No Wallet Connected'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-mono">
                    {isConnected ? 'Ethereum Sepolia (Chain 11155111)' : 'Click Connect Button'}
                  </p>
                </div>
              </div>
              <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!isConnected || !idInput.trim() || !nameInput.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
              isConnected && idInput.trim() && nameInput.trim()
                ? 'bg-primary text-on-primary hover:bg-inverse-surface cursor-pointer'
                : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Examination Catalog</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-center gap-2 text-center text-xs font-mono text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-secondary">gavel</span>
          <span>FIPS 140-3 Cryptographic Integrity • National Digital Identity Framework</span>
        </div>
      </div>
    </div>
  );
}
