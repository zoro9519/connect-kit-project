import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const ledger = (): WalletProps => {
  return {
    id: 'ledger',
    name: 'Ledger Live',
    shortName: 'Ledger',
    logos: {
      default: <Logos.Ledger />,
    },
    logoBackground: '#000',
    scannable: false,
    downloadUrls: {
      website: 'https://www.ledger.com/ledger-live/download#download-device-2',
      download: 'https://connect.family.co/v0/download/ledger',
      android: 'https://play.google.com/store/apps/details?id=com.ledger.live',
      ios: 'https://apps.apple.com/app/ledger-live-web3-wallet/id1361671700',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
