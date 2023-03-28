import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const unstoppable = (): WalletProps => {
  return {
    id: 'unstoppable',
    name: 'Unstoppable',
    logos: {
      default: <Logos.Unstoppable />,
    },
    logoBackground: 'linear-gradient(180deg, #FED812 0%, #FFAF00 100%)',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/unstoppable',
      ios: 'https://apps.apple.com/app/bank-bitcoin-wallet/id1447619907',
      android:
        'https://play.google.com/store/apps/details?id=io.horizontalsystems.bankwallet',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://unstoppable.money/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
