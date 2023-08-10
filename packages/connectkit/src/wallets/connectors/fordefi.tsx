import { WalletProps } from '../wallet';

import Logos from '../../assets/logos';

import { isFordefi } from '../../utils/wallets';

export const fordefi = (): WalletProps => {
  const isInstalled = isFordefi();

  return {
    id: 'fordefi',
    name: 'Fordefi',
    logos: {
      default: <Logos.Fordefi />,
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {},
    installed: isInstalled,
  };
};
