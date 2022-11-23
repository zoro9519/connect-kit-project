import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { useContext, useState } from 'react';
import Button from '../../Common/Button';
import { DisconnectIcon, RetryIcon } from '../../../assets/icons';
import { SIWEContext } from './SIWEContext';
import { ResetContainer } from '../../../styles';
import { motion } from 'framer-motion';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocales from '../../../hooks/useLocales';

enum ButtonState {
  READY = 'ready',
  LOADING = 'loading',
  SUCCESS = 'success',
  REJECTED = 'rejected',
  ERROR = 'error',
}

type ButtonProps = {
  showSignOutButton?: boolean;
  onSignIn?: () => void;
};

export const SIWEButton: React.FC<ButtonProps> = ({
  showSignOutButton,
  onSignIn,
}) => {
  const siweContext = useContext(SIWEContext);
  const isMounted = useIsMounted();

  const locales = useLocales();

  const { address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const [currentStatus, setStatus] = useState<ButtonState>(ButtonState.READY);

  // TODO: refactor
  const status = siweContext?.session.data?.address
    ? ButtonState.SUCCESS
    : siweContext?.session.isLoading || siweContext?.nonce.isLoading
    ? ButtonState.LOADING
    : currentStatus;

  function getButtonLabel(state: ButtonState) {
    const labels = {
      [ButtonState.READY]: locales.signIn,
      [ButtonState.LOADING]: locales.awaitingConfirmation,
      [ButtonState.REJECTED]: locales.tryAgain,
      [ButtonState.ERROR]: 'Unknown Error',
      [ButtonState.SUCCESS]: locales.signedIn,
    };
    // TODO: discuss non-connected wallet developer expectations
    return !address ? locales.walletNotConnected : labels[state];
  }

  const onError = (error: any) => {
    console.error('signIn error', error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
        setStatus(ButtonState.REJECTED);
        break;
      case 'ACTION_REJECTED': // MetaMask: user rejected
        setStatus(ButtonState.REJECTED);
        break;
      default:
        setStatus(ButtonState.ERROR);
    }
  };

  const signIn = async () => {
    try {
      if (!siweContext) {
        throw new Error('SIWE not configured');
      }

      const chainId = activeChain?.id;
      if (!address) throw new Error('No address found');
      if (!chainId) throw new Error('No chainId found');

      const nonce = siweContext.nonce.data;
      if (!nonce) {
        throw new Error('Could not fetch nonce');
      }

      setStatus(ButtonState.LOADING);

      const message = siweContext.createMessage({
        address,
        chainId,
        nonce,
      });

      // Ask user to sign message with their wallet
      const signature = await signMessageAsync({
        message,
      });

      // Verify signature
      if (!(await siweContext.verifyMessage({ message, signature }))) {
        throw new Error('Error verifying SIWE signature');
      }

      await siweContext.session.refetch();
      setStatus(ButtonState.READY);
      onSignIn?.();
    } catch (error) {
      onError(error);
    }
  };

  if (!siweContext) {
    throw new Error('SIWEButton must be inside a SIWEProvider.');
  }

  if (!isMounted)
    return <Button key="loading" style={{ margin: 0 }} disabled />;

  if (showSignOutButton && status === ButtonState.SUCCESS) {
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={siweContext.signOutAndRefetch}
        icon={<DisconnectIcon />}
      >
        {locales.signOut}
      </Button>
    );
  }

  return (
    <Button
      key="button"
      style={{ margin: 0 }}
      arrow={address ? status === ButtonState.READY : false}
      onClick={
        status !== ButtonState.LOADING && status !== ButtonState.SUCCESS
          ? signIn
          : undefined
      }
      disabled={
        !address ||
        siweContext.nonce.isFetching ||
        status === ButtonState.LOADING ||
        status === ButtonState.SUCCESS
      }
      waiting={status === ButtonState.LOADING}
      icon={
        status === ButtonState.REJECTED && (
          <motion.div
            initial={{
              rotate: -270,
            }}
            animate={{
              rotate: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.175, 0.885, 0.32, 0.98],
            }}
          >
            <RetryIcon style={{ opacity: 0.4 }} />
          </motion.div>
        )
      }
    >
      {getButtonLabel(status)}
    </Button>
  );
};

export const SIWEButtonComponent: React.FC<ButtonProps> = ({ ...props }) => (
  <ResetContainer>
    <SIWEButton {...props} />
  </ResetContainer>
);
export default SIWEButtonComponent;
