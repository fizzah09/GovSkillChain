import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'MetaMask & Browser Wallets',
      wallets: [metaMaskWallet, injectedWallet],
    },
  ],
  {
    appName: 'GovSkill Chain',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
  ssr: true,
});
