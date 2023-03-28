import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const steak = (): WalletProps => {
  return {
    id: 'steak',
    name: 'Steak',
    logos: {
      default: <Logos.Steak />,
    },
    logoBackground: '#000000',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/steak',
      android:
        'https://play.google.com/store/apps/details?id=fi.steakwallet.app',
      ios: 'https://apps.apple.com/app/steakwallet/id1569375204',
      website: 'https://steakwallet.fi/download',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://links.steakwallet.fi/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
