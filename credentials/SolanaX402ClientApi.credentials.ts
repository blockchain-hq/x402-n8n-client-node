import {
    ICredentialType,
    INodeProperties,
  } from 'n8n-workflow';
  
  export class SolanaX402ClientApi implements ICredentialType {
    name = 'pocketNodeClientApi';
    displayName = 'Pocket node client';
    documentationUrl = 'https://github.com/blockchain-hq/x402-pocket-node-client';
    
    properties: INodeProperties[] = [
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
        options: [
          {
            name: 'Devnet',
            value: 'devnet',
          },
          {
            name: 'Mainnet',
            value: 'mainnet-beta',
          },
        ],
        default: 'devnet',
        description: 'Solana network to use',
      },
      {
        displayName: 'Wallet Private Key',
        name: 'privateKey',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        placeholder: 'Base58 encoded private key',
        description: 'Your Solana wallet private key (will be used to pay)',
      },
      {
        displayName: 'RPC URL',
        name: 'rpcUrl',
        type: 'string',
        default: '',
        placeholder: 'https://api.devnet.solana.com',
        description: 'Optional custom RPC endpoint URL',
      },
    ];
  }