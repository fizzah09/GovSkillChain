'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col w-full">
      {/* Federal E-Governance Mandate Announcement Marquee */}
      <div className="w-full bg-surface-container-high py-2 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-on-surface-variant font-mono text-xs">
          <div className="flex items-center gap-2 tracking-wide uppercase">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-on-surface">Federal E-Governance Mandate:</span>
            <span>Public Competency Standard Activated for Ethereum Sepolia Ledger</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-secondary font-semibold">
              <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
              ISO/IEC 27001 &amp; W3C VC Verifiable
            </span>
            <span className="hidden lg:inline text-outline-variant">|</span>
            <span className="hidden lg:inline">Gas Optimization Relay: Active (0.0004 ETH Avg)</span>
          </div>
        </div>
      </div>

      {/* Hero & Citizen Onboarding Hub */}
      <section className="relative w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#0b1c30 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Narrative & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full shadow-sm">
              <svg viewBox="0 0 44 48" fill="none" className="w-4 h-4 inline-block shrink-0">
                <path d="M22 2L40 9V22C40 33.5 32.5 41.5 22 46C11.5 41.5 4 33.5 4 22V9L22 2Z" fill="#1E3A8A" stroke="#2563EB" strokeWidth="2"/>
                <circle cx="22" cy="18" r="4" fill="#38BDF8"/>
                <circle cx="15" cy="28" r="3.5" fill="#60A5FA"/>
                <circle cx="29" cy="28" r="3.5" fill="#60A5FA"/>
                <path d="M22 18L15 28M22 18L29 28M15 28H29" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="22" cy="35" r="2.5" fill="#F59E0B"/>
              </svg>
              <span className="font-mono text-xs font-bold tracking-widest text-on-surface uppercase">
                National Accredited Talent Infrastructure
              </span>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                v2.4.9
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Government-Certified Skills,{' '}
                <span className="text-secondary underline decoration-secondary/30 underline-offset-8">
                  Verified on Blockchain
                </span>
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Empowering citizens with tamper-proof, cryptographically signed competency credentials
                auto-evaluated against strict civil service criteria and permanently minted as ERC-5192
                Soulbound tokens to the Sepolia Ethereum Ledger.
              </p>
            </div>

            {/* Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/tests"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold text-sm rounded-lg shadow-md hover:bg-inverse-surface transition-all active:scale-[0.99] no-underline"
              >
                <span className="material-symbols-outlined text-xl">verified_user</span>
                <span>Take a Skill Test</span>
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-lowest text-on-surface font-semibold text-sm rounded-lg border border-outline-variant/40 shadow-sm hover:bg-surface-container transition-all no-underline"
              >
                <span className="material-symbols-outlined text-secondary text-xl">fact_check</span>
                <span>Verify a Certificate</span>
              </Link>
              <a
                href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 text-secondary hover:text-on-secondary-container text-sm font-semibold transition-colors no-underline group"
              >
                <span>Sepolia Explorer</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
                  north_east
                </span>
              </a>
            </div>

            {/* Trust Anchors Micro-bar */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-base">domain</span>
                  <span className="font-mono text-[11px] uppercase font-bold">Governance</span>
                </div>
                <p className="text-sm font-bold text-on-surface mt-1">Cabinet Approved</p>
                <span className="text-xs text-on-surface-variant font-mono">Statute § 19-B/2024</span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span className="font-mono text-[11px] uppercase font-bold">Privacy</span>
                </div>
                <p className="text-sm font-bold text-on-surface mt-1">Zero-Knowledge</p>
                <span className="text-xs text-on-surface-variant font-mono">Citizen ID Cloaked</span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-base">token</span>
                  <span className="font-mono text-[11px] uppercase font-bold">Standard</span>
                </div>
                <p className="text-sm font-bold text-on-surface mt-1">Soulbound Token</p>
                <span className="text-xs text-on-surface-variant font-mono">ERC-5192 Locked</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Assurance Sovereign Credential Inspection Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/60 shadow-lg relative overflow-hidden">
              {/* Sovereign Watermark Crest */}
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/50">
                    <span className="material-symbols-outlined text-2xl">shield</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">SOVEREIGN SKILL CREDENTIAL</h3>
                    <p className="text-xs text-on-surface-variant font-mono">MINISTRY OF DIGITAL CERTIFICATION</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold rounded">
                  VERIFIED
                </span>
              </div>

              {/* Sample Certificate Details */}
              <div className="py-4 space-y-3">
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono">
                    Certified Competency Domain
                  </span>
                  <h4 className="text-base font-bold text-on-surface">
                    Civic Law &amp; Digital Governance
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-lg font-mono text-xs">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">EVALUATION SCORE</span>
                    <span className="font-bold text-emerald-700 text-sm">95 / 100 (High Distinction)</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">ATTESTATION TYPE</span>
                    <span className="font-bold text-on-surface text-sm">EIP-712 Government Signed</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">LEDGER NETWORK</span>
                    <span className="font-bold text-on-surface text-sm">Ethereum Sepolia</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">TOKEN STANDARD</span>
                    <span className="font-bold text-on-surface text-sm">ERC-5192 Soulbound</span>
                  </div>
                </div>

                <div className="p-2.5 bg-surface-container-lowest border border-dashed border-outline-variant/60 rounded font-mono text-[11px] flex justify-between items-center text-on-surface-variant">
                  <span>Cryptographic Proof:</span>
                  <span className="text-secondary font-bold truncate max-w-[200px]">0x9f2d...81c8</span>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-2">
                {!isConnected ? (
                  <div className="w-full flex justify-center">
                    <ConnectButton />
                  </div>
                ) : (
                  <Link
                    href="/tests"
                    className="w-full py-2.5 bg-secondary text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors no-underline shadow-sm"
                  >
                    <span>View Assessment Catalog</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Examination & Minting Workflow */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest">
              Standardized Examination Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
              How Citizens Earn Sovereign Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-secondary text-white font-mono font-bold text-xs flex items-center justify-center mb-3">
                01
              </span>
              <h3 className="font-bold text-sm text-on-surface mb-1">Connect MetaMask</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Connect your Ethereum wallet on Sepolia testnet to establish your unique sovereign identity.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-secondary text-white font-mono font-bold text-xs flex items-center justify-center mb-3">
                02
              </span>
              <h3 className="font-bold text-sm text-on-surface mb-1">Select Domain</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Choose from 5 federal competence domains including Civic Law, Digital Governance, and Public Finance.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-secondary text-white font-mono font-bold text-xs flex items-center justify-center mb-3">
                03
              </span>
              <h3 className="font-bold text-sm text-on-surface mb-1">Timed Assessment</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Take the official test. The backend anti-tamper engine validates answers against statutory keys.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-secondary text-white font-mono font-bold text-xs flex items-center justify-center mb-3">
                04
              </span>
              <h3 className="font-bold text-sm text-on-surface mb-1">Soulbound Minting</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pass with 70%+ to instantly mint your non-transferable certificate directly on Ethereum Sepolia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
