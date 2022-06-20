import { motion } from 'framer-motion';
import styled from 'styled-components';
import { TooltipSizeProps } from './types';

export const TooltipWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
export const TooltipContainer = styled(motion.div)<{ $size: TooltipSizeProps }>`
  --shadow: var(--tooltip-shadow);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
  width: fit-content;
  max-width: 258px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => (props.$size === 'small' ? 11 : 14)}px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  color: var(--tooltip-color);
  background: var(--tooltip-background);
  box-shadow: var(--shadow);
  > span {
    z-index: 3;
    position: relative;
  }
  > div {
    margin: -4px 0; // offset for icon
  }
  strong {
    color: var(--spinner-color);
  }

  .ck-tt-logo {
    display: inline-block;
    vertical-align: text-bottom;
    height: 1em;
    width: 1.25em;
    svg {
      display: block;
      height: 100%;
      transform: translate(0.5px, -1px) scale(1.75);
    }
  }
`;

export const TooltipTail = styled(motion.div)<{ $size: TooltipSizeProps }>`
  z-index: 2;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
  right: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    width: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
    height: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
    transform: translate(75%, 0) rotate(-45deg);
    background: var(--tooltip-background);
    box-shadow: var(--shadow);
    border-radius: ${(props) => (props.$size === 'small' ? 2 : 3)}px 0 0 0;
  }
`;
