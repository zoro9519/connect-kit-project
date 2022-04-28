import React from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { ModalHeading } from '../Modal/styles';
import Logos from '../../assets/logos';

const Container = styled(motion.div)`
  min-width: 100%;
  width: 310px;
`;
const ConnectingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0 16px;
  height: 120px;
`;

const LogoContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  //background: var(--body-background-secondary);
  svg {
    z-index: 3;
    position: relative;
    display: block;
  }
`;
const Spinner = styled(motion.div)`
  z-index: 1;
  position: absolute;
  inset: -50%;
  //animation: rotateGradient 600ms ease-out; // extra spin on init
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(
      from -90deg,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      var(--family-brand)
    );
    animation: rotateGradient 1200ms linear infinite;
  }
  @keyframes rotateGradient {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const SpinnerCap = styled(motion.div)`
  z-index: 5;
  position: absolute;
  top: 50%;
  left: 1px;
  right: 50%;
  height: 3px;
  transform-origin: 100% 50%;
  animation: rotateGradient 1200ms linear infinite,
    rotateCap 1200ms ease-in-out infinite;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 3px;
    background: var(--family-brand);
    border-radius: 3px;
  }
  @keyframes rotateCap {
    0%,
    25%,
    50%,
    75%,
    100% {
      left: 0%;
    }
    12.5%,
    37.5%,
    62.5%,
    87.5% {
      left: -7.5%;
    }
  }
`;
const Logo = styled(motion.div)`
  z-index: 2;
  position: absolute;
  overflow: hidden;
  inset: 6px;
  border-radius: 16px;
  background: var(--body-background-secondary);
  svg,
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const Heading = styled(motion.div)`
  padding: 0 16px 6px;
  text-align: center;
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  color: var(--body-color);
`;
const Body = styled(motion.div)`
  padding: 0 16px 38px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: var(--body-color-muted);
`;

const MetaMask: React.FC = () => {
  return (
    <Container>
      <ModalHeading>MetaMask</ModalHeading>
      <ConnectingContainer>
        <LogoContainer>
          <Logo>{Logos.MetaMask}</Logo>
          <Spinner />
          <svg width="102" height="102" viewBox="0 0 102 102" fill="none">
            <rect
              x="7.57895"
              y="7.57895"
              width="86.8421"
              height="86.8421"
              rx="19.2211"
              stroke="black"
              strokeOpacity="0.02"
              strokeWidth="1.15789"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H102V102H0V0ZM7 38.284C7 27.5684 7 22.2106 9.01905 18.0892C10.9522 14.1431 14.1431 10.9522 18.0892 9.01905C22.2106 7 27.5684 7 38.284 7H63.716C74.4316 7 79.7894 7 83.9108 9.01905C87.8569 10.9522 91.0478 14.1431 92.9809 18.0892C95 22.2106 95 27.5684 95 38.284V63.716C95 74.4316 95 79.7894 92.9809 83.9108C91.0478 87.8569 87.8569 91.0478 83.9108 92.9809C79.7894 95 74.4316 95 63.716 95H38.284C27.5684 95 22.2106 95 18.0892 92.9809C14.1431 91.0478 10.9522 87.8569 9.01905 83.9108C7 79.7894 7 74.4316 7 63.716V38.284ZM41.5 0.5H41.4325C34.7246 0.499996 29.6023 0.499994 25.5104 0.823325C21.388 1.14906 18.1839 1.80986 15.3416 3.20227C10.0602 5.78959 5.78959 10.0602 3.20227 15.3416C1.80986 18.1839 1.14906 21.388 0.823325 25.5104C0.499994 29.6023 0.499996 34.7246 0.5 41.4325V41.5V55.5938C0.5 55.6808 0.507407 55.766 0.521624 55.849C0.507407 55.9319 0.5 56.0172 0.5 56.1042V60.5V60.5675C0.499996 67.2754 0.499994 72.3977 0.823325 76.4896C1.14906 80.612 1.80986 83.8161 3.20227 86.6584C5.78959 91.9398 10.0602 96.2104 15.3416 98.7977C18.1839 100.19 21.388 100.851 25.5104 101.177C29.6022 101.5 34.7244 101.5 41.432 101.5H41.4324H41.5H43.4227H60.5H60.5675H60.568C67.2756 101.5 72.3977 101.5 76.4896 101.177C80.612 100.851 83.8161 100.19 86.6584 98.7977C91.9398 96.2104 96.2104 91.9398 98.7977 86.6584C100.19 83.8161 100.851 80.612 101.177 76.4896C101.5 72.3978 101.5 67.2756 101.5 60.568V60.5676V60.5V41.5V41.4324V41.432C101.5 34.7244 101.5 29.6022 101.177 25.5104C100.851 21.388 100.19 18.1839 98.7977 15.3416C96.2104 10.0602 91.9398 5.78959 86.6584 3.20227C83.8161 1.80986 80.612 1.14906 76.4896 0.823325C72.3977 0.499994 67.2754 0.499996 60.5675 0.5H60.5H41.5ZM3.5 56.1042C3.5 56.0172 3.49259 55.9319 3.47838 55.849C3.49259 55.766 3.5 55.6808 3.5 55.5938V41.5C3.5 34.7112 3.50109 29.7068 3.814 25.7467C4.1256 21.8032 4.73946 19.0229 5.89635 16.6614C8.19077 11.9779 11.9779 8.19077 16.6614 5.89635C19.0229 4.73946 21.8032 4.1256 25.7467 3.814C29.7068 3.50109 34.7112 3.5 41.5 3.5H60.5C67.2888 3.5 72.2932 3.50109 76.2533 3.814C80.1968 4.1256 82.977 4.73946 85.3386 5.89635C90.022 8.19077 93.8092 11.9779 96.1036 16.6614C97.2605 19.0229 97.8744 21.8032 98.186 25.7467C98.4989 29.7068 98.5 34.7112 98.5 41.5V60.5C98.5 67.2888 98.4989 72.2932 98.186 76.2533C97.8744 80.1968 97.2605 82.9771 96.1036 85.3386C93.8092 90.022 90.022 93.8092 85.3386 96.1036C82.977 97.2605 80.1968 97.8744 76.2533 98.186C72.2932 98.4989 67.2888 98.5 60.5 98.5H43.4227H41.5C34.7112 98.5 29.7068 98.4989 25.7467 98.186C21.8032 97.8744 19.0229 97.2605 16.6614 96.1036C11.9779 93.8092 8.19077 90.022 5.89635 85.3386C4.73946 82.9771 4.1256 80.1968 3.814 76.2533C3.50109 72.2932 3.5 67.2888 3.5 60.5V56.1042Z"
              fill="var(--body-background)"
            />
          </svg>
        </LogoContainer>
      </ConnectingContainer>
      <Heading>Requesting Connection</Heading>
      <Body>Open the MetaMask browser extension to connect your wallet.</Body>
    </Container>
  );
};

export default MetaMask;
