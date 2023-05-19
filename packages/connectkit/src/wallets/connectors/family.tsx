import { WalletProps } from './../wallet';
import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const family = (): WalletProps => {
  return {
    id: 'family',
    name: 'Family',
    logos: {
      default: <Logos.Family />,
    },
    logoBackground: '#7DC4FF',
    scannable: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/family',
      ios: 'https://family.co/download',
      website: 'https://family.co',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `familywallet://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
