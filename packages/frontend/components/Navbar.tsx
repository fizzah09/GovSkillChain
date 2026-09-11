'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navLinks = [
  { href: '/', label: 'Overview & Portal' },
  { href: '/tests', label: 'Available Tests' },
  { href: '/verify', label: 'Verify Certificate' },
  { href: '/certificates', label: 'My Certificates' },
  { href: '/admin', label: 'Admin Console' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Sovereign Masthead */}
      <div className="bg-primary-container text-on-primary-container px-4 sm:px-6 lg:px-8 py-1">
        <div className="max-w-container-max mx-auto flex items-center justify-between text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-surface-container-highest uppercase font-semibold">
              Official Sovereign Infrastructure • Department of Digital Attestation
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-surface-container-highest">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-emerald-400">verified_user</span>
              TLS 1.3 / EAL6+ Certified
            </span>
            <span className="text-outline-variant">|</span>
            <span>Immutable Ledger Node #04</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18 py-3">
        {/* Civic Logo & Branding */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant/50 flex items-center justify-center p-1 shadow-sm group-hover:border-secondary transition-colors overflow-hidden">
            {/* Embedded Official Shield Emblem */}
            <svg viewBox="0 0 44 48" fill="none" className="w-8 h-8">
              <path d="M22 2L40 9V22C40 33.5 32.5 41.5 22 46C11.5 41.5 4 33.5 4 22V9L22 2Z" fill="#1E3A8A" stroke="#2563EB" strokeWidth="2"/>
              <circle cx="22" cy="18" r="4" fill="#38BDF8"/>
              <circle cx="15" cy="28" r="3.5" fill="#60A5FA"/>
              <circle cx="29" cy="28" r="3.5" fill="#60A5FA"/>
              <path d="M22 18L15 28M22 18L29 28M15 28H29" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="22" cy="35" r="2.5" fill="#F59E0B"/>
              <path d="M15 28L22 35M29 28L22 35" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 1"/>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-on-surface tracking-tight leading-none">
                GovSkill<span className="text-secondary">Chain</span>
              </span>
              <span className="px-2 py-0.5 bg-surface-container-high text-secondary rounded text-[10px] font-bold font-mono border border-outline-variant/40">
                SEPOLIA
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium mt-0.5 tracking-wide">
              NATIONAL DIGITAL CERTIFICATION
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all no-underline ${
                  isActive
                    ? 'bg-primary-container text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs font-mono text-on-surface">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Sepolia: 11155111</span>
          </div>

          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus="address"
          />
        </div>
      </div>

      {/* Mobile Submenu */}
      <div className="lg:hidden flex overflow-x-auto border-t border-outline-variant/20 px-3 py-2 gap-1 bg-surface-container-lowest">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap px-3 py-1 rounded text-xs font-medium no-underline transition-colors ${
                isActive
                  ? 'bg-primary-container text-white'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
