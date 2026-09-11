'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { api, TestDomain } from '../../lib/api';
import StatusBanner from '../../components/StatusBanner';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const domainIcons: Record<string, string> = {
  'civic-law': 'balance',
  'digital-governance': 'terminal',
  'public-finance': 'payments',
  'admin-management': 'corporate_fare',
  'health-safety': 'health_and_safety',
};

export default function TestsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [domains, setDomains] = useState<TestDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    api
      .listTests()
      .then(setDomains)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleStart(domainId: string) {
    if (!address) return;
    setStarting(domainId);
    setError('');

    try {
      const session = await api.startTest(domainId, address);
      sessionStorage.setItem(`session_${session.sessionId}`, JSON.stringify(session));
      router.push(`/tests/${session.sessionId}`);
    } catch (e: any) {
      setError(e.message || 'Failed to start test');
      setStarting(null);
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-4 border border-outline-variant/40">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Sovereign Wallet Required</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          You must connect your Ethereum wallet on Sepolia testnet to authorize your identity for competency assessments.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-container-max mx-auto space-y-8">
        {/* Page Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-outline-variant/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-surface-container-high rounded text-secondary text-xs font-mono font-bold mb-2">
              <span className="material-symbols-outlined text-sm">school</span>
              <span>ACTIVE EXAMINATION SCHEDULE · FISCAL YEAR 2025</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              Federal Competency Assessments
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Select an accredited public service discipline. Upon passing, a Soulbound Certificate NFT is cryptographically issued to your wallet.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/40">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Attestor Node: Active</span>
            <span className="text-outline-variant">|</span>
            <span>Passing Threshold: 65% - 70%</span>
          </div>
        </div>

        {error && <StatusBanner type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 animate-pulse space-y-4"
              >
                <div className="w-12 h-12 bg-surface-container rounded-lg"></div>
                <div className="h-4 bg-surface-container rounded w-3/4"></div>
                <div className="h-3 bg-surface-container rounded w-full"></div>
                <div className="h-10 bg-surface-container rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => {
              const iconName = domainIcons[domain.id] || 'verified';
              const isStarting = starting === domain.id;

              return (
                <div
                  key={domain.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 hover:border-secondary/60 transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header: Icon & Domain Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/40 group-hover:bg-secondary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">{iconName}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-surface-container text-on-surface-variant rounded border border-outline-variant/30 uppercase">
                        {domain.id}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-base text-on-surface group-hover:text-secondary transition-colors">
                        {domain.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                        {domain.description}
                      </p>
                    </div>

                    {/* Assessment Metadata Matrix */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-surface-container-low rounded-lg font-mono text-[11px] border border-outline-variant/20 text-center">
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase">Pass Mark</span>
                        <span className="font-bold text-emerald-700">{domain.passingScore}%</span>
                      </div>
                      <div className="border-x border-outline-variant/30">
                        <span className="text-[9px] text-on-surface-variant block uppercase">Duration</span>
                        <span className="font-bold text-on-surface">{domain.durationMinutes} min</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase">Questions</span>
                        <span className="font-bold text-on-surface">{domain.questionCount} MCQs</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Exam CTA */}
                  <div className="pt-5 border-t border-outline-variant/20 mt-4">
                    <button
                      onClick={() => handleStart(domain.id)}
                      disabled={isStarting}
                      className="w-full py-2.5 px-4 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-inverse-surface transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] shadow-sm cursor-pointer"
                    >
                      {isStarting ? (
                        <>
                          <span className="inline-block animate-spin text-sm">⏳</span>
                          <span>Initializing Session...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                          <span>Start Assessment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
