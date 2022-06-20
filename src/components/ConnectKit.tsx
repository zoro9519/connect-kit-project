import React, {
  createContext,
  createElement,
  useEffect,
  useState,
} from 'react';
import { CustomTheme, Languages, Theme } from '../types';

import ConnectKitModal from '../components/ConnectModal';

export const routes = {
  ONBOARDING: 'onboarding',
  ABOUT: 'about',
  CONNECTORS: 'connectors',
  MOBILECONNECTORS: 'mobileConnectors',
  CONNECT: 'connect',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchNetworks',
};

type Connector = any;
type Error = string | null;
type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  customTheme: CustomTheme | undefined;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: string;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
  errorMessage: Error;
  debug: (message: string | null, code?: any) => void;
};

const Context = createContext<ContextValue | null>(null);

type ConnectKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  language?: Languages;
  customTheme?: CustomTheme | undefined;
};
export const ConnectKitProvider: React.FC<ConnectKitProviderProps> = ({
  children,
  theme = 'auto',
  language = 'en',
  customTheme,
}) => {
  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>({});
  const [ckLang, setLang] = useState<Languages>(language);
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<string>('');
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [errorMessage, setErrorMessage] = useState<Error>('');

  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(language), [language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  const value = {
    theme: ckTheme,
    setTheme,
    customTheme,
    setCustomTheme,
    lang: ckLang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,
    errorMessage,
    debug: (message, code) => {
      setErrorMessage(message);

      console.log('---------CONNECTKIT DEBUG---------');
      console.log(message);
      if (code) console.table(code);
      console.log('---------/CONNECTKIT DEBUG---------');
    },
  };
  return createElement(
    Context.Provider,
    { value },
    <>
      {children}
      <ConnectKitModal lang={ckLang} theme={ckTheme} />
    </>
  );
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('ConnectKit must be inside a Provider.');
  return context;
};
