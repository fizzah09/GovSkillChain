'use client';

import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../lib/wagmi';
import { CitizenProvider } from '../context/CitizenContext';
import Navbar from '../components/Navbar';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>GovSkill Chain — Blockchain-Verified Government Competency Registry</title>
        <meta
          name="description"
          content="Official sovereign competence registry and skill certification infrastructure. Citizens take standardized tests and receive ERC-5192 soulbound NFT credentials minted on Ethereum Sepolia."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/logo.svg"
        />
      </head>
      <body className="bg-background text-on-surface font-sans antialiased min-h-screen">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={lightTheme({
                accentColor: '#1e3a8a',
                accentColorForeground: '#ffffff',
                borderRadius: 'small',
                fontStack: 'system',
              })}
            >
              <CitizenProvider>
                <div className="min-h-screen flex flex-col bg-background">
                  <Navbar />
                  <main className="flex-1 w-full">{children}</main>
                  <footer className="w-full bg-surface-container-high py-space-lg px-gutter-desktop border-t border-outline-variant/30 text-on-surface-variant text-xs">
                    <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-space-sm font-mono">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-sm text-secondary">verified_user</span>
                        <span>GovSkill Chain — Official Sovereign Competency Infrastructure</span>
                      </div>
                      <div className="flex items-center gap-space-md">
                        <span>Sepolia Testnet (11155111)</span>
                        <span>•</span>
                        <span>ERC-5192 Soulbound Standards</span>
                        <span>•</span>
                        <span>EIP-712 Attestation</span>
                      </div>
                    </div>
                  </footer>
                </div>
              </CitizenProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
