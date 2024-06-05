import { FunctionComponent, ComponentProps } from 'react';
import { SIWEProvider } from 'connectkit';
import type { IncomingMessage, ServerResponse } from 'http';
import { getIronSession, IronSession, IronSessionOptions } from 'iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { Chain, Transport, PublicClient, createPublicClient, http } from 'viem';
import * as allChains from 'viem/chains';
import {
  generateSiweNonce,
  createSiweMessage,
  parseSiweMessage,
} from 'viem/siwe';

type RouteHandlerOptions = {
  afterNonce?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWESession<{}>
  ) => Promise<void>;
  afterVerify?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWESession<{}>
  ) => Promise<void>;
  afterSession?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWESession<{}>
  ) => Promise<void>;
  afterLogout?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

type NextServerSIWEConfig = {
  config?: {
    chains: readonly [Chain, ...Chain[]];
    transports?: Record<number, Transport>;
  };
  session?: Partial<IronSessionOptions>;
  options?: RouteHandlerOptions;
};

type NextClientSIWEConfig = {
  apiRoutePrefix: string;
  statement?: string;
};

type NextSIWESession<TSessionData extends Object = {}> = IronSession &
  TSessionData & {
    nonce?: string;
    address?: string;
    chainId?: number;
  };

type NextSIWEProviderProps = Omit<
  ComponentProps<typeof SIWEProvider>,
  | 'getNonce'
  | 'createMessage'
  | 'verifyMessage'
  | 'getSession'
  | 'signOut'
  | 'data'
  | 'signIn'
  | 'status'
  | 'resetStatus'
>;

type ConfigureServerSIWEResult<TSessionData extends Object = {}> = {
  apiRouteHandler: NextApiHandler;
  getSession: (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<NextSIWESession<TSessionData>>;
};

type ConfigureClientSIWEResult<TSessionData extends Object = {}> = {
  Provider: FunctionComponent<NextSIWEProviderProps>;
};

const getSession = async <TSessionData extends Object = {}>(
  req: IncomingMessage,
  res: any, // ServerResponse<IncomingMessage>,
  sessionConfig: IronSessionOptions
) => {
  const session = (await getIronSession(
    req,
    res,
    sessionConfig
  )) as NextSIWESession<TSessionData>;
  return session;
};

const logoutRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<void>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterLogout']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      session.destroy();
      if (afterCallback) {
        await afterCallback(req, res);
      }
      res.status(200).end();
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const nonceRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<string>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterNonce']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      if (!session.nonce) {
        session.nonce = generateSiweNonce();
        await session.save();
      }
      if (afterCallback) {
        await afterCallback(req, res, session);
      }
      res.send(session.nonce);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const sessionRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<{ address?: string; chainId?: number }>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterSession']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      if (afterCallback) {
        await afterCallback(req, res, session);
      }
      const { address, chainId } = session;
      res.send({ address, chainId });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const verifyRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<void>,
  sessionConfig: IronSessionOptions,
  config?: NextServerSIWEConfig['config'],
  afterCallback?: RouteHandlerOptions['afterVerify']
) => {
  switch (req.method) {
    case 'POST':
      try {
        const session = await getSession(req, res, sessionConfig);
        const { message, signature } = req.body as {
          message: string;
          signature: `0x${string}`;
        };

        const parsed = parseSiweMessage(message);
        if (parsed.nonce !== session.nonce) {
          return res.status(422).end('Invalid nonce.');
        }

        let chain = config?.chains
          ? Object.values(config.chains).find((c) => c.id === parsed.chainId)
          : undefined;
        if (!chain) {
          // Try to find chain from allChains if not found in user-provided chains
          chain = Object.values(allChains).find((c) => c.id === parsed.chainId);
        }
        if (!chain) {
          throw new Error('Chain not found.');
        }

        const publicClient: PublicClient = createPublicClient({
          chain,
          transport: http(),
        });

        const verified = await publicClient.verifySiweMessage({
          message,
          signature,
          nonce: session.nonce,
        });
        if (!verified) {
          return res.status(422).end('Unable to verify signature.');
        }

        session.address = parsed.address;
        session.chainId = parsed.chainId;
        await session.save();
        if (afterCallback) {
          await afterCallback(req, res, session);
        }
        res.status(200).end();
      } catch (error) {
        res.status(400).end(String(error));
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const envVar = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const configureServerSideSIWE = <TSessionData extends Object = {}>({
  config,
  session: { cookieName, password, cookieOptions, ...otherSessionOptions } = {},
  options: { afterNonce, afterVerify, afterSession, afterLogout } = {},
}: NextServerSIWEConfig): ConfigureServerSIWEResult<TSessionData> => {
  const sessionConfig: IronSessionOptions = {
    cookieName: cookieName ?? 'connectkit-next-siwe',
    password: password ?? envVar('SESSION_SECRET'),
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      ...(cookieOptions ?? {}),
    },
    ...otherSessionOptions,
  };

  const apiRouteHandler: NextApiHandler = async (req, res) => {
    if (!(req.query.route instanceof Array)) {
      throw new Error(
        'Catch-all query param `route` not found. SIWE API page should be named `[...route].ts` and within your `pages/api` directory.'
      );
    }

    const route = req.query.route.join('/');
    switch (route) {
      case 'nonce':
        return await nonceRoute(req, res, sessionConfig, afterNonce);
      case 'verify':
        return await verifyRoute(req, res, sessionConfig, config, afterVerify);
      case 'session':
        return await sessionRoute(req, res, sessionConfig, afterSession);
      case 'logout':
        return await logoutRoute(req, res, sessionConfig, afterLogout);
      default:
        return res.status(404).end();
    }
  };

  return {
    apiRouteHandler,
    getSession: async (req: IncomingMessage, res: ServerResponse) =>
      await getSession<TSessionData>(req, res, sessionConfig),
  };
};

export const configureClientSIWE = <TSessionData extends Object = {}>({
  apiRoutePrefix,
  statement = 'Sign In With Ethereum.',
}: NextClientSIWEConfig): ConfigureClientSIWEResult<TSessionData> => {
  const NextSIWEProvider = (props: NextSIWEProviderProps) => {
    return (
      <SIWEProvider
        getNonce={async () => {
          const res = await fetch(`${apiRoutePrefix}/nonce`);
          if (!res.ok) {
            throw new Error('Failed to fetch SIWE nonce');
          }
          const nonce = await res.text();
          return nonce;
        }}
        createMessage={({ nonce, address, chainId }) =>
          createSiweMessage({
            version: '1',
            domain: window.location.host,
            uri: window.location.origin,
            address,
            chainId,
            nonce,
            statement,
          })
        }
        verifyMessage={({ message, signature }) =>
          fetch(`${apiRoutePrefix}/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, signature }),
          }).then((res) => res.ok)
        }
        getSession={async () => {
          const res = await fetch(`${apiRoutePrefix}/session`);
          if (!res.ok) {
            throw new Error('Failed to fetch SIWE session');
          }
          const { address, chainId } = await res.json();
          return address && chainId ? { address, chainId } : null;
        }}
        signOut={() => fetch(`${apiRoutePrefix}/logout`).then((res) => res.ok)}
        {...props}
      />
    );
  };

  return {
    Provider: NextSIWEProvider,
  };
};
