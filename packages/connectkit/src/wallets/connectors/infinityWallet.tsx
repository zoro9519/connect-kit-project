import { WalletProps } from './../wallet';

import { isInfinityWallet } from '../../utils';
import Logos from './../../assets/logos';

export const infinityWallet = (): WalletProps => {
  const isInstalled = isInfinityWallet();

  return {
    id: 'infinityWallet',
    name: 'Infinity Wallet',
    logos: {
      default: <Logos.InfinityWallet />,
      mobile: <Logos.InfinityWallet />,
      transparent: <Logos.InfinityWallet />,
      appIcon: <Logos.InfinityWallet />,
      connectorButton: <Logos.InfinityWallet />,
    },
    logoBackground: '#08a1d5',
    scannable: false,
    downloadUrls: {
      download: 'https://infinitywallet.io/download',
      website: 'https://infinitywallet.io/download',
      chrome: 'https://infinitywallet.io/download',
      firefox: 'https://infinitywallet.io/download',
      brave: 'https://infinitywallet.io/download',
      edge: 'https://infinitywallet.io/download',
    },
    installed: Boolean(isInstalled),
  };
};
