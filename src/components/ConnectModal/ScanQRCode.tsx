import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';
import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';
import { OrDivider } from '../Modal';
import { ModalContent, ModalHeading } from '../Modal/styles';
import { detectBrowser } from '../../utils';
import BrowserIcon from '../BrowserIcon';

import supportedConnectors from '../../constants/supportedConnectors';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const ScanQRCode: React.FC<{ connectorId: string }> = ({ connectorId }) => {
  const connector = supportedConnectors.filter((c) => c.id === connectorId)[0];

  const { connectors } = useConnect();
  const [connectorUri, setConnectorUri] = useState<string | null>(null);

  const handleQRCode: Listener = (err, payload) => {
    if (err) console.log(err);
    const uri = payload.params[0];
    setConnectorUri(uri);
  };

  const startConnect = async () => {
    const c = connectors.filter((c) => c.id === connectorId)[0];
    if (!c) return;

    const p = await c.getProvider();

    switch (c.id) {
      case 'coinbaseWallet':
        console.log(p);
        // TODO: Coinbase Wallet qrUrl
        // From Lochie: I found this value, not sure if it's usable or not.
        //setConnectorUri(p.qrUrl);
        break;
      case 'walletConnect':
        p.connect();
        p.connector.on('display_uri', handleQRCode);
        break;
      case 'injected':
        // Shouldn't get to this flow, injected is not scannable
        break;
    }
  };

  useEffect(() => {
    if (!connectorUri) startConnect();
  }, []);

  if (!connector) return <>Connector not found</>;

  const browser = detectBrowser();
  const extensionUrl = connector.extensions
    ? connector.extensions[browser]
    : undefined;

  const hasExtensionInstalled =
    connector.extensionIsInstalled && connector.extensionIsInstalled();

  return (
    <Container>
      <ModalHeading>Scan QR Code</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <CustomQRCode value={connectorUri} image={connector.logo} />
        <OrDivider />
      </ModalContent>
      {connector.defaultConnect && (
        <Button icon={connector.logo} onClick={connector.defaultConnect}>
          Open {connector.name}
        </Button>
      )}
      {!hasExtensionInstalled && extensionUrl && (
        <Button href={extensionUrl} icon={<BrowserIcon />}>
          Install the Extension
        </Button>
      )}
      {hasExtensionInstalled && (
        <Button icon={connector.logo}>Launch Extension</Button>
      )}
    </Container>
  );
};

export default ScanQRCode;
