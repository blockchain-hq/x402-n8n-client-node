/**
 * Pocket Node Wallet Credential
 * Auto-generates Solana wallet for USDC payments
 */

import {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export class PocketNodeWallet implements ICredentialType {
  name = 'pocketNodeWallet';
  displayName = 'Pocket Node Wallet';
  documentationUrl = 'https://github.com/blockchain-hq/x402-pocket-node-client';
  
  properties: INodeProperties[] = [
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      options: [
        {
          name: 'Devnet (Testing)',
          value: 'devnet',
        },
        {
          name: 'Mainnet (Production)',
          value: 'mainnet-beta',
        },
      ],
      default: 'devnet',
      description: 'Solana network to use. Generate a new wallet or import an existing one. Fund it with SOL (for fees) and USDC to enable automatic payments.',
    },
    {
      displayName: 'Wallet Address',
      name: 'address',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Solana wallet address (public key). Enter address or generate new wallet using the helper function.',
      placeholder: 'Enter address or generate new wallet',
    },
    {
      displayName: 'Private Key',
      name: 'privateKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your wallet private key (base58 encoded). KEEP THIS SECRET! Enter private key or generate new wallet using the helper function. After generating/importing wallet: 1) Fund with SOL (for transaction fees) - Devnet: https://faucet.solana.com, Mainnet: Buy SOL on exchange. 2) Fund with USDC (for payments) - Devnet: Use USDC faucet, Mainnet: Transfer USDC to your address.',
      placeholder: 'Enter private key or generate new wallet',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.network === "mainnet-beta" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com"}}',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: ['={{$credentials.address}}'],
      },
    },
  };
}

/**
 * Helper function to generate wallet (can be called from n8n UI or code)
 */
export function generateNewWallet(): {
  address: string;
  privateKey: string;
} {
  const keypair = Keypair.generate();
  return {
    address: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
}
