import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiConfig, createClient } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient, SIWESession } from 'connectkit';
import { TestBenchProvider, useTestBench } from '../TestbenchProvider';
import { siweClient } from '../utils/siweClient';

const client = createClient(
  getDefaultClient({
    //chains: [mainnet, polygon],
    appName: 'ConnectKit testbench',
    appIcon: '/app.png',
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    //walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme } = useTestBench();

  // SIWE provider needs to be the outer-most provider because the connect kit
  // provider depends on some of the state

  return (
    <siweClient.Provider
      onSignIn={(data?: SIWESession) => {
        console.log('onSignIn Provider', data);
      }}
      onSignOut={() => {
        console.log('onSignOut Provider');
      }}
    >
      <ConnectKitProvider
        theme={theme}
        mode={mode}
        options={options}
        customTheme={customTheme}
        onConnect={(data) => {
          console.log('onConnect Provider', data);
        }}
        onDisconnect={() => {
          console.log('onDisconnect Provider');
        }}
        debugMode
      >
        <Component {...pageProps} />
      </ConnectKitProvider>
    </siweClient.Provider>
  );
}
function MyApp(appProps: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>ConnectKit Testbench</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <WagmiConfig client={client}>
        <TestBenchProvider
        //customTheme={{ '--ck-font-family': 'monospace' }}
        >
          <App {...appProps} />
        </TestBenchProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
