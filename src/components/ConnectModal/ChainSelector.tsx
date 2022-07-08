import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { routes, useContext } from '../ConnectKit';

import { useNetwork } from 'wagmi';
import supportedChains from '../../constants/supportedChains';

import useMeasure from 'react-use-measure';
import { isMobile } from '../../utils';

import SwitchNetworksList from './SwitchNetworksList';

import Portal from '../Common/Portal';
import { ResetContainer } from '../../styles';

import styled, { css } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import Tooltip from '../Common/Tooltip';
import defaultTheme from '../../constants/defaultTheme';
import {
  ConnectKitThemeProvider,
  useThemeContext,
} from '../ConnectKitThemeProvider/ConnectKitThemeProvider';

const Container = styled(motion.div)``;

const DropdownWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
`;
const DropdownOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
`;
const DropdownContainer = styled(motion.div)`
  pointer-events: auto;
  --shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 292px;
  border-radius: var(--tooltip-border-radius, 12px);
  padding: 14px 16px 8px;
  color: var(--tooltip-color);
  background: var(--tooltip-background);
  box-shadow: var(--tooltip-shadow, var(--shadow));
`;
const DropdownHeading = styled(motion.div)`
  padding: 0 0 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
  color: var(--body-color-muted);
`;

const SwitchChainButton = styled(motion.button)`
  --color: var(--button-primary-color, var(--body-color));
  --background: var(
    --ck-secondary-button-background,
    var(--body-background-secondary)
  );
  --box-shadow: var(
    --ck-secondary-button-box-shadow,
    var(--button-primary-box-shadow),
    none
  );

  --hover-color: var(--button-primary-hover-color, var(--color));
  --hover-background: var(
    --ck-secondary-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-secondary-button-hover-box-shadow,
    var(--box-shadow)
  );

  --active-color: var(--button-primary-active-color, var(--hover-color));
  --active-background: var(
    --ck-secondary-button-active-background,
    var(--hover-background)
  );
  --active-box-shadow: var(
    --ck-secondary-button-active-box-shadow,
    var(--hover-box-shadow)
  );

  --shadow: 0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05);
  appearance: none;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  width: 52px;
  height: 30px;
  padding: 2px 6px 2px 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  text-decoration: none;
  color: var(--body-color-muted);
  background: var(--background);
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease,
    box-shadow 100ms ease;
  transform: translateZ(0px);
  box-shadow: var(--shadow);

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);

  svg {
    position: relative;
    display: block;
  }

  ${(props) =>
    props.disabled
      ? css`
          width: auto;
          padding: 3px;
          position: relative;
          left: -22px;
        `
      : css`
          cursor: pointer;

          @media only screen and (min-width: ${defaultTheme.mobileWidth +
            1}px) {
            &:hover,
            &:focus {
              color: var(--hover-color);
              background: var(--hover-background);
              box-shadow: var(--hover-box-shadow);
            }
            &:active {
              color: var(--active-color);
              background: var(--active-background);
              box-shadow: var(--active-box-shadow);
            }
          }
        `}
`;
const ChainIcon = styled(motion.div)<{ $empty?: boolean }>`
  display: block;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background: var(--body-background);
  color: var(--body-color-muted);
  svg {
    width: 100%;
    height: auto;
  }
  ${(props) =>
    props.$empty &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--body-background-secondary);
      &:before {
        content: '?';
        font-weight: bold;
        font-family: var(--font-family);
      }
    `}
`;

const ChevronDown = ({ ...props }) => (
  <svg
    aria-hidden="true"
    width="11"
    height="6"
    viewBox="0 0 11 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.5 1L5.5 5L9.5 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChainSelector: React.FC = () => {
  const context = useContext();
  const themeContext = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const { chain, chains } = useNetwork();

  const mobile = isMobile() || window?.innerWidth < defaultTheme.mobileWidth;

  const targetRef = useRef<any>(null);
  const [ref, bounds] = useMeasure({
    offsetSize: true,
    scroll: true,
  });

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (
      !targetRef.current ||
      bounds.top +
        bounds.bottom +
        bounds.left +
        bounds.right +
        bounds.height +
        bounds.width ===
        0
    )
      return;
    const x = -12 + bounds.left;
    const y = 9 + bounds.top + bounds.height;
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, isOpen]);

  useEffect(() => {
    if (!context.open) setIsOpen(false);
  }, [context.open]);

  const disabled = chains.length <= 1;
  const ChainSelectorButton = (
    <ChainIcon $empty={!chains.find((x) => x.id === chain?.id)}>
      <AnimatePresence initial={false}>
        {chains
          .filter((x) => x.id === chain?.id)
          .map((x, i) => {
            const c = supportedChains.find((c) => c.id === x.id);
            return (
              <motion.div
                key={chain?.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {c?.logo}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </ChainIcon>
  );

  return (
    <ConnectKitThemeProvider>
      <Container>
        <SwitchChainButton
          ref={ref}
          aria-label="Change Network"
          disabled={disabled}
          onClick={() => {
            if (mobile) {
              context.setRoute(routes.SWITCHNETWORKS);
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          {disabled ? (
            <Tooltip message={`${chain?.name} Network`} xOffset={-6}>
              {ChainSelectorButton}
            </Tooltip>
          ) : (
            ChainSelectorButton
          )}
          {!disabled && <ChevronDown style={{ top: 1, left: -3 }} />}
        </SwitchChainButton>
      </Container>
      <Portal>
        <AnimatePresence>
          {!mobile && isOpen && (
            <ResetContainer
              $useTheme={themeContext.theme}
              $useMode={themeContext.mode}
              $customTheme={themeContext.customTheme}
            >
              <DropdownWindow>
                <DropdownOverlay onClick={() => setIsOpen(false)} />
                <DropdownContainer
                  ref={targetRef}
                  initial={'collapsed'}
                  animate={'open'}
                  exit={'collapsed'}
                  variants={{
                    collapsed: {
                      transformOrigin: '0 0',
                      opacity: 0,
                      scale: 0.96,
                      z: 0.01,
                      y: -4,
                      x: 0,
                      transition: {
                        duration: 0.1,
                      },
                    },
                    open: {
                      transformOrigin: '0 0',
                      willChange: 'opacity,transform',
                      opacity: 1,
                      scale: 1,
                      z: 0.01,
                      y: 0,
                      x: 0,
                      transition: {
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.15,
                      },
                    },
                  }}
                >
                  <DropdownHeading>Switch Networks</DropdownHeading>
                  <SwitchNetworksList />
                </DropdownContainer>
              </DropdownWindow>
            </ResetContainer>
          )}
        </AnimatePresence>
      </Portal>
    </ConnectKitThemeProvider>
  );
};

export default ChainSelector;
