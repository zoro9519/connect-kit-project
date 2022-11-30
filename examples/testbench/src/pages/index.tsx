import type { NextPage } from 'next';
import {
  ConnectKitButton,
  Types,
  Avatar,
  useSIWE,
  SIWEButton,
  ChainIcon,
} from 'connectkit';
import { useTestBench } from '../TestbenchProvider';
import { Checkbox, Textbox, Select, SelectProps } from '../components/inputs';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useNetwork,
  useSignMessage,
  useSignTypedData,
  usePrepareSendTransaction,
} from 'wagmi';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import Link from 'next/link';

import CustomAvatar from '../components/CustomAvatar';

/** TODO: import this data from the connectkit module */
const themes: SelectProps[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Web95', value: 'web95' },
  { label: 'Retro', value: 'retro' },
  { label: 'Soft', value: 'soft' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Midnight', value: 'midnight' },
  { label: 'Nouns', value: 'nouns' },
];
const modes: SelectProps[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];
const languages: SelectProps[] = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'French', value: 'fr-FR' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'Japanese', value: 'ja-JP' },
  { label: 'Chinese', value: 'zh-CN' },
];

const AccountInfo = () => {
  const { address, connector } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { chain } = useNetwork();
  const siwe = useSIWE();

  return (
    <ul>
      <li>ChainID: {chain?.id}</li>
      <li>Chain name: {chain?.name}</li>
      <li>Chain Supported: {chain?.unsupported ? 'No' : 'Yes'}</li>
      <li>Address: {address}</li>
      <li>Connector: {connector?.id}</li>
      <li>Balance: {balanceData?.formatted}</li>
      <li>
        SIWE session: {siwe.signedIn ? 'yes' : 'no'}
        {siwe.signedIn && <button onClick={siwe.signOut}>sign out</button>}
      </li>
      <li>
        <Link href="/siwe/token-gated">Token-gated page</Link>
      </li>
    </ul>
  );
};

const Actions = () => {
  const { isConnected, address } = useAccount();

  const {
    signMessage,
    isLoading: signMessageIsLoading,
    isError: signMessageIsError,
  } = useSignMessage({
    message: 'fam token wen',
  });
  const {
    signTypedData,
    isLoading: signTypedDataIsLoading,
    isError: signTypedDataIsError,
  } = useSignTypedData({
    // All properties on a domain are optional
    domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    // The named list of all type definitions
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    value: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    },
  });
  const { config } = usePrepareSendTransaction({
    request: {
      to: address?.toString() ?? '',
      value: BigNumber.from('0'),
    },
  });
  const {
    sendTransaction,
    isLoading: sendTransactionIsLoading,
    isError: sendTransactionIsError,
  } = useSendTransaction(config);

  const testSignMessage = () => {
    signMessage();
  };
  const testSignTypedData = () => {
    signTypedData();
  };
  const testSendTransaction = () => {
    sendTransaction?.();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <h2>Actions {!isConnected && `(connect to test)`}</h2>
      <button disabled={!isConnected} onClick={testSignMessage}>
        {signMessageIsError
          ? 'Error. Check console'
          : signMessageIsLoading
          ? 'Waiting...'
          : 'Sign message'}
      </button>
      <button disabled={!isConnected} onClick={testSignTypedData}>
        {signTypedDataIsError
          ? 'Error. Check console'
          : signTypedDataIsLoading
          ? 'Waiting...'
          : 'Sign typed data'}
      </button>
      <button disabled={!isConnected} onClick={testSendTransaction}>
        {sendTransactionIsError
          ? 'Error. Check console'
          : sendTransactionIsLoading
          ? 'Waiting...'
          : 'Send transaction'}
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const {
    theme,
    setTheme,
    customTheme,
    setCustomTheme,
    mode,
    setMode,
    options,
    setOptions,
    label,
    setLabel,
    hideAvatar,
    setHideAvatar,
    hideBalance,
    setHideBalance,
  } = useTestBench();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { chain } = useNetwork();

  if (!mounted) return null;

  return (
    <>
      <main>
        <p>Connect Button</p>
        <ConnectKitButton label={label} />

        <hr />
        <p>Sign In With Ethereum</p>
        <SIWEButton showSignOutButton />

        <hr />
        <AccountInfo />

        <hr />
        <p>Avatars</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Avatar name="lochie.eth" />
          <Avatar name="pugson.eth" size={32} />
          <Avatar
            address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
            size={12}
          />
          <Avatar name="benjitaylor.eth" size={64} />
        </div>

        <hr />
        <p>Chains</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <ChainIcon id={chain?.id} unsupported={chain?.unsupported} />
          <ChainIcon id={1} />
          <ChainIcon id={1337} />
          <ChainIcon id={2} unsupported />
        </div>
      </main>
      <aside>
        <ConnectKitButton.Custom>
          {({ isConnected, show, address, ensName }) => {
            return (
              <button onClick={show}>
                {isConnected ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Avatar address={address} size={12} />
                    {ensName ?? address}
                  </div>
                ) : (
                  'Custom Connect'
                )}
              </button>
            );
          }}
        </ConnectKitButton.Custom>

        <Actions />
        <h2>ConnectKitButton props</h2>
        <Textbox
          label="ConnectKitButton Label"
          value={label}
          onChange={(e: any) => {
            setLabel(e.target.value);
          }}
        />
        <Checkbox
          label="hideAvatar"
          value="hideAvatar"
          checked={hideAvatar}
          onChange={() => setHideAvatar(!hideAvatar)}
        />
        <Checkbox
          label="hideBalance"
          value="hideBalance"
          checked={hideBalance}
          onChange={() => setHideBalance(!hideBalance)}
        />
        <h2>ConnectKitProvider props</h2>
        <Select
          label="Theme"
          value={theme}
          options={themes}
          onChange={(e) => setTheme(e.target.value as Types.Theme)}
        />
        <Select
          label="Mode"
          value={mode}
          options={modes}
          onChange={(e) => setMode(e.target.value as Types.Mode)}
        />
        <Select
          label="Language"
          value={options.language}
          options={languages}
          onChange={(e) =>
            setOptions({
              ...options,
              language: e.target.value as Types.Languages,
            })
          }
        />
        <h3>options</h3>
        <Textbox
          label="disclaimer"
          value={options.disclaimer}
          onChange={(e: any) => {
            setOptions({ ...options, disclaimer: e.target.value });
          }}
        />
        <Textbox
          label="walletConnectName"
          value={options.walletConnectName}
          onChange={(e: any) => {
            setOptions({ ...options, walletConnectName: e.target.value });
          }}
        />
        <Checkbox
          label="customAvatar"
          value="customAvatar"
          checked={options.customAvatar !== undefined}
          onChange={() =>
            setOptions({
              ...options,
              customAvatar: options.customAvatar ? undefined : CustomAvatar,
            })
          }
        />
        <Checkbox
          label="Custom Font"
          value="customTheme"
          checked={customTheme['--ck-font-family'] !== undefined}
          onChange={() => {
            setCustomTheme(
              customTheme['--ck-font-family'] !== undefined
                ? {}
                : { '--ck-font-family': 'monospace' }
            );
          }}
        />
        <Checkbox
          label="reduceMotion"
          value="reduceMotion"
          checked={options.reduceMotion}
          onChange={() =>
            setOptions({ ...options, reducedMotion: !options.reduceMotion })
          }
        />
        <Checkbox
          label="truncateLongENSAddress"
          value="truncateLongENSAddress"
          checked={options.truncateLongENSAddress}
          onChange={() =>
            setOptions({
              ...options,
              truncateLongENSAddress: !options.truncateLongENSAddress,
            })
          }
        />
        <Checkbox
          label="hideTooltips"
          value="hideTooltips"
          checked={options.hideTooltips}
          onChange={() =>
            setOptions({ ...options, hideTooltips: !options.hideTooltips })
          }
        />
        <Checkbox
          label="hideQuestionMarkCTA"
          value="hideQuestionMarkCTA"
          checked={options.hideQuestionMarkCTA}
          onChange={() =>
            setOptions({
              ...options,
              hideQuestionMarkCTA: !options.hideQuestionMarkCTA,
            })
          }
        />
        <Checkbox
          label="hideNoWalletCTA"
          value="hideNoWalletCTA"
          checked={options.hideNoWalletCTA}
          onChange={() =>
            setOptions({
              ...options,
              hideNoWalletCTA: !options.hideNoWalletCTA,
            })
          }
        />
        <Checkbox
          label="avoidLayoutShift"
          value="avoidLayoutShift"
          checked={options.avoidLayoutShift}
          onChange={() =>
            setOptions({
              ...options,
              avoidLayoutShift: !options.avoidLayoutShift,
            })
          }
        />
        <Checkbox
          disabled
          label="embedGoogleFonts"
          value="embedGoogleFonts"
          checked={options.embedGoogleFonts}
          onChange={() =>
            setOptions({
              ...options,
              embedGoogleFonts: !options.embedGoogleFonts,
            })
          }
        />
        <Checkbox
          disabled
          label="bufferPolyfill"
          value="bufferPolyfill"
          checked={options.bufferPolyfill}
          onChange={() =>
            setOptions({
              ...options,
              bufferPolyfill: !options.bufferPolyfill,
            })
          }
        />
        <Select
          label="walletConnectCTA"
          value={options.walletConnectCTA}
          options={[
            { label: 'modal', value: 'modal' },
            { label: 'link', value: 'link' },
            { label: 'both', value: 'both' },
          ]}
          onChange={(e) =>
            setOptions({
              ...options,
              walletConnectCTA: e.target.value as any,
            })
          }
        />
      </aside>
    </>
  );
};

export default Home;
