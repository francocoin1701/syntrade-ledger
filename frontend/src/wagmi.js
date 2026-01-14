import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'SynTrade Ledger',
  // Este es un ID público de prueba. Si falla, crea uno gratis en cloud.walletconnect.com
  projectId: '3a8170812b534d0ff9d794f19a901d64', 
  chains: [sepolia],
  transports: {
    // Usamos Alchemy para evitar bloqueos
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/9fFkirzbRny5GFXB6TNe9zscq3qY94LG'),
  },
  ssr: false,
});