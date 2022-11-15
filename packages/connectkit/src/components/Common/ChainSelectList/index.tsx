import React from 'react';

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import supportedChains from '../../../constants/supportedChains';

import {
  SwitchNetworksContainer,
  ChainButton,
  ChainButtonContainer,
  ChainButtonBg,
  ChainButtonStatus,
  ChainButtons,
  ChainIcon,
  ChainLogoContainer,
  ChainLogoSpinner,
} from './styles';
import Alert from '../Alert';

import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from '../../../utils';

import ChainIcons from '../../../assets/chains';
import useLocales from '../../../hooks/useLocales';

const Spinner = (
  <svg
    aria-hidden="true"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 16.75C2.69036 16.75 3.25 17.3096 3.25 18V19C3.25 26.5939 9.40609 32.75 17 32.75V35.25C8.02537 35.25 0.75 27.9746 0.75 19V18C0.75 17.3096 1.30964 16.75 2 16.75Z"
      fill="url(#paint0_linear_1288_18701)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1288_18701"
        x1="2"
        y1="19.4884"
        x2="16.8752"
        y2="33.7485"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--ck-spinner-color)" />
        <stop offset="1" stopColor="var(--ck-spinner-color)" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const ChainSelectList: React.FC = () => {
  const { connector } = useAccount();
  const { chain, chains } = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  const locales = useLocales({});

  const mobile = isMobile();

  return (
    <SwitchNetworksContainer style={{ marginBottom: switchNetwork ? -8 : 0 }}>
      <ChainButtonContainer>
        <ChainButtons>
          {chains.map((x) => {
            const c = supportedChains.find((ch) => ch.id === x.id);
            const ch = { ...c, ...x };
            return (
              <ChainButton
                key={`${ch?.id}-${ch?.name}`}
                disabled={
                  !switchNetwork ||
                  ch.id === chain?.id ||
                  (isLoading && pendingChainId === ch.id)
                }
                onClick={() => switchNetwork?.(ch.id)}
                style={{
                  opacity:
                    !switchNetwork && ch.id !== chain?.id ? 0.4 : undefined,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 12,
                    color:
                      ch.id === chain?.id
                        ? 'var(--ck-dropdown-active-color, inherit)'
                        : 'inherit',
                  }}
                >
                  <ChainLogoContainer>
                    <ChainLogoSpinner
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isLoading && pendingChainId === ch.id ? 1 : 0,
                      }}
                      transition={{
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.15,
                      }}
                    >
                      <motion.div
                        key={`${ch?.id}-${ch?.name}`}
                        animate={
                          // UI fix for Coinbase Wallet on mobile does not remove isLoading on rejection event
                          mobile &&
                          connector?.id === 'coinbaseWallet' &&
                          isLoading &&
                          pendingChainId === ch.id
                            ? {
                                opacity: [1, 0],

                                transition: { delay: 4, duration: 3 },
                              }
                            : { opacity: 1 }
                        }
                      >
                        {Spinner}
                      </motion.div>
                    </ChainLogoSpinner>
                    <ChainIcon>
                      {ch.logo ?? <ChainIcons.UnknownChain />}
                    </ChainIcon>
                  </ChainLogoContainer>
                  {ch.name}
                </span>
                <ChainButtonStatus>
                  <AnimatePresence initial={false} exitBeforeEnter>
                    {ch.id === chain?.id && (
                      <motion.span
                        key={'connectedText'}
                        style={{
                          color:
                            'var(--ck-dropdown-active-color, var(--ck-focus-color))',
                          display: 'block',
                          position: 'relative',
                        }}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: 4,
                          transition: { duration: 0.1, delay: 0 },
                        }}
                        transition={{
                          ease: [0.76, 0, 0.24, 1],
                          duration: 0.3,
                          delay: 0.2,
                        }}
                      >
                        {locales.connected}
                      </motion.span>
                    )}
                    {isLoading && pendingChainId === ch.id && (
                      <motion.span
                        key={'approveText'}
                        style={{
                          color: 'var(--ck-dropdown-pending-color, inherit)',
                          display: 'block',
                          position: 'relative',
                        }}
                        initial={{
                          opacity: 0,
                          x: -4,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{
                          ease: [0.76, 0, 0.24, 1],
                          duration: 0.3,
                        }}
                      >
                        <motion.span
                          animate={
                            // UI fix for Coinbase Wallet on mobile does not remove isLoading on rejection event
                            mobile &&
                            connector?.id === 'coinbaseWallet' && {
                              opacity: [1, 0],
                              transition: { delay: 4, duration: 4 },
                            }
                          }
                        >
                          {locales.approveInWallet}
                        </motion.span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </ChainButtonStatus>
                {
                  //hover === ch.name && (
                  ch.id === chain?.id && (
                    <ChainButtonBg
                      layoutId="activeChain"
                      layout="position"
                      transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                    />
                  )
                }
              </ChainButton>
            );
          })}
        </ChainButtons>
      </ChainButtonContainer>
      {!switchNetwork && (
        <Alert>
          {locales.warnings_walletSwitchingUnsupported}{' '}
          {locales.warnings_walletSwitchingUnsupportedResolve}
        </Alert>
      )}
    </SwitchNetworksContainer>
  );
};

export default ChainSelectList;
