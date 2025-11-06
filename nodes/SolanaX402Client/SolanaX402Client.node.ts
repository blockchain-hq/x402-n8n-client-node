import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
  } from 'n8n-workflow';
  
  import { SolanaX402Client as X402SDK } from 'x402-client-sdk';
  import { Keypair } from '@solana/web3.js';
  import bs58 from 'bs58';
  
  export class SolanaX402Client implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'Pocket node client',
      name: 'pocketNodeClient',
      icon: 'file:pocket.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter["operation"]}}',
      description: 'Make SOL payments in response to HTTP 402 errors',
      defaults: {
        name: 'Pocket node client',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
        {
          name: 'pocketNodeClientApi',
          required: true,
        },
      ],
      properties: [
        // Operation
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'Parse 402 Response',
              value: 'parse402',
              description: 'Parse payment requirements from 402 response',
              action: 'Parse payment requirements',
            },
            {
              name: 'Make Payment',
              value: 'makePayment',
              description: 'Send SOL payment for parsed requirements',
              action: 'Make SOL payment',
            },
            {
              name: 'Parse and Pay',
              value: 'parseAndPay',
              description: 'Parse 402 response and immediately make payment',
              action: 'Parse and pay in one step',
            },
          ],
          default: 'parseAndPay',
        },
  
        // Fields for Parse 402 & Parse and Pay
        {
          displayName: '402 Response Body',
          name: 'response402',
          type: 'json',
          required: true,
          displayOptions: {
            show: {
              operation: ['parse402', 'parseAndPay'],
            },
          },
          default: '',
          placeholder: '{"version":"1.0","paymentOptions":[...]}',
          description: 'The payment requirements from the 402 response body',
        },
  
        // Fields for Make Payment
        {
          displayName: 'Recipient Address',
          name: 'recipient',
          type: 'string',
          required: true,
          displayOptions: {
            show: {
              operation: ['makePayment'],
            },
          },
          default: '',
          placeholder: '8qEoLvRsumJpNCn7Q5PT19W5X5g62TKjCaMBDVBpu1hr',
          description: 'Solana address to send payment to',
        },
        {
          displayName: 'Amount (SOL)',
          name: 'amount',
          type: 'number',
          required: true,
          displayOptions: {
            show: {
              operation: ['makePayment'],
            },
          },
          default: 0.01,
          description: 'Amount in SOL to send',
          typeOptions: {
            minValue: 0.000001,
            numberPrecision: 9,
          },
        },
        {
          displayName: 'Payment ID',
          name: 'paymentId',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['makePayment'],
            },
          },
          default: '',
          placeholder: 'payment-12345',
          description: 'Optional payment identifier',
        },
      ],
    };
  
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const items = this.getInputData();
      const returnData: INodeExecutionData[] = [];
  
      // Get credentials
      const credentials = await this.getCredentials('pocketNodeClientApi');
      
      // Initialize client
      const client = new X402SDK({  // ← Use X402SDK instead
        network: credentials.network as 'devnet' | 'mainnet-beta',
        rpcUrl: credentials.rpcUrl as string || undefined,
      });
  
      // Load wallet keypair
      let payer: Keypair;
      try {
        const privateKey = credentials.privateKey as string;
        const decoded = bs58.decode(privateKey);
        payer = Keypair.fromSecretKey(decoded);
      } catch (error) {
        throw new NodeOperationError(
          this.getNode(),
          'Invalid private key format. Must be base58 encoded.',
        );
      }
  
      // Process each input item
      for (let i = 0; i < items.length; i++) {
        try {
          const operation = this.getNodeParameter('operation', i) as string;
  
          let responseData: any;
  
          if (operation === 'parse402') {
            // Parse 402 Response
            const response402 = this.getNodeParameter('response402', i) as any;
            
            const parsed = client.parsePaymentRequirements(response402);
            
            responseData = {
              parsed: true,
              paymentDetails: parsed,
            };
  
          } else if (operation === 'makePayment') {
            // Make Payment (manual)
            const recipient = this.getNodeParameter('recipient', i) as string;
            const amount = this.getNodeParameter('amount', i) as number;
            const paymentId = this.getNodeParameter('paymentId', i, '') as string;
  
            const paymentRequest = {
              amount,
              recipient,
              token: 'native',
              network: credentials.network as string,
              decimals: 9,
              paymentOptionId: paymentId || `manual-${Date.now()}`,
            };
  
            const result = await client.executePayment(payer, paymentRequest);
            
            responseData = {
              success: true,
              signature: result.signature,
              amount: result.amount,
              recipient: result.recipient,
              timestamp: result.timestamp,
              explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=${credentials.network}`,
            };
  
          } else if (operation === 'parseAndPay') {
            // Parse and Pay (one step)
            const response402 = this.getNodeParameter('response402', i) as any;
            
            const result = await client.payFor402Response(payer, response402);
            
            responseData = {
              success: true,
              signature: result.signature,
              amount: result.amount,
              recipient: result.recipient,
              timestamp: result.timestamp,
              explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=${credentials.network}`,
            };
          }
  
          returnData.push({
            json: responseData,
            pairedItem: { item: i },
          });
  
        } catch (error) {
          // Error handling
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: error.message,
              },
              pairedItem: { item: i },
            });
            continue;
          }
          throw new NodeOperationError(
            this.getNode(),
            error.message,
            { itemIndex: i }
          );
        }
      }
  
      return [returnData];
    }
  }