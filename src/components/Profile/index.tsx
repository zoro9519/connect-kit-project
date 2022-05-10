import React, { useEffect, useState } from 'react';
import { useContext } from '../FamilyKit';
import localizations from '../../constants/localizations';
import { truncateEthAddress } from '../../utils';

import {
  useConnect,
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
} from 'wagmi';

import {
  Container,
  AvatarContainer,
  AvatarInner,
  ChainSelectorContainer,
} from './styles';

import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../Modal/styles';
import Button from '../Button';
import Avatar from '../Avatar';
import ChainSelector from '../ConnectModal/ChainSelector';

import { DisconnectIcon } from '../../assets/icons';

const Profile: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].profileScreen;

  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
  const { data: balance } = useBalance({
    addressOrName: account?.address,
    //watch: true,
  });

  useEffect(() => {
    if (!shouldDisconnect) return;
    setTimeout(() => {
      disconnect();
      reset();
    }, 1000);
  }, [shouldDisconnect, disconnect, reset]);

  if (!isConnected || shouldDisconnect)
    return (
      <Container>
        <ModalHeading>{copy.heading}</ModalHeading>
        <ModalContent>
          <ModalH1>Disconnecting...</ModalH1>
        </ModalContent>
      </Container>
    );
  return (
    <Container>
      <ModalHeading>{copy.heading}</ModalHeading>
      <ModalContent>
        <AvatarContainer>
          <AvatarInner>
            <ChainSelectorContainer>
              <ChainSelector />
            </ChainSelectorContainer>
            <Avatar address={account?.address} />
          </AvatarInner>
        </AvatarContainer>
        <ModalH1>
          {ensName ? ensName : truncateEthAddress(account?.address)}
        </ModalH1>
        <ModalBody>
          {Number(balance?.formatted).toPrecision(3)} {balance?.symbol}
        </ModalBody>
      </ModalContent>
      <Button
        onClick={() => setShouldDisconnect(true)}
        icon={<DisconnectIcon />}
      >
        Disconnect
      </Button>
    </Container>
  );
};

export default Profile;
