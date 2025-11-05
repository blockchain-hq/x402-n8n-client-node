# n8n-nodes-solana-x402-client

n8n community node for making SOL payments in response to HTTP 402 errors. Client-side implementation of x402 protocol.

[![npm version](https://badge.fury.io/js/n8n-nodes-solana-x402-client.svg)](https://www.npmjs.com/package/n8n-nodes-solana-x402-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 What It Does

- ✅ Parse 402 payment requirements
- ✅ Make SOL payments automatically
- ✅ Return transaction signatures
- ✅ Integrate with any 402-enabled API

## 📦 Installation

### In n8n (Recommended)

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter: `n8n-nodes-solana-x402-client`
4. Click **Install**

### Manual Installation

```bash
# 1. Install the package
npm install x402-client-sdk

# 2. Link for development
npm link x402-client-sdk

# 3. Set custom extensions path
export N8N_CUSTOM_EXTENSIONS="$HOME/x402-n8n-nodes"

# 4. Start n8n
n8n start

# 5. In n8n, search for: "Solana x402 Client"
# The node will appear with a Solana icon
```

## 🚀 Operations

### 1. Parse 402 Response

Extracts payment details from 402 response.

**Input:** 402 response body
**Output:** Payment details (amount, recipient)

### 2. Make Payment

Sends SOL to specified address.

**Input:**
- Recipient address
- Amount (SOL)
- Payment ID (optional)

**Output:** Transaction signature

### 3. Parse and Pay ⭐

Parse and pay in one step (recommended!)

**Input:** 402 response body
**Output:** Transaction signature

## 🔐 Credentials

**Solana x402 Client API:**
- Network: Devnet or Mainnet
- Wallet Private Key: Base58 encoded
- RPC URL: (optional)

**Get Private Key:**
```bash
solana address -k ~/wallet.json
cat ~/wallet.json
```

## 📋 Example Workflow

**Works with Mock Server node for testing:**

```
Solana x402 (Mock Server) → Returns 402
    ↓
Solana x402 Client → Parse and Pay
    ↓
Solana x402 (Mock Server) → Verify Payment
    ↓
Get Content ✅
```

**Or with real API:**

```
HTTP Request → Get 402 from real API
    ↓
Solana x402 Client → Parse and Pay (sends SOL)
    ↓
HTTP Request → Retry with X-Payment signature
    ↓
Get Content ✅
```

## 🎓 Use Cases

| Use Case | Description |
|----------|-------------|
| **Testing with Mock** | Use with Solana x402 Mock Server node |
| **Auto-pay APIs** | Automatic payment on 402 |
| **Content Access** | Pay for premium content |
| **Subscription** | Automated renewal |
| **Pay-per-use** | Pay as you go |

**Perfect combo:** Use with the Solana x402 Mock Server node to test complete payment flows in n8n without building APIs!

## 💰 Wallet Setup

**Devnet (Testing):**
```bash
# Generate wallet
solana-keygen new -o ~/devnet-wallet.json

# Get SOL
solana airdrop 2 YOUR_ADDRESS --url devnet

# Get private key
cat ~/devnet-wallet.json
```

**Mainnet (Production):**
- Use existing wallet
- Ensure sufficient SOL balance
- Keep private key secure

## 🔄 Full Payment Flow

```
1. Request API
2. Get 402 response
3. Use "Parse and Pay"
4. Get signature
5. Retry request with X-Payment header
6. Access granted ✅
```

## 🔒 Security

**Best Practices:**
- Never commit private keys
- Use environment variables
- Start with small amounts on devnet
- Test thoroughly before mainnet

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Node not visible | Restart n8n, clear cache |
| Invalid private key | Use base58 format |
| Insufficient balance | Get more SOL (airdrop/purchase) |
| Transaction failed | Check network and balance |

## 🌐 Networks

**Devnet:**
- Free testing
- Get SOL via airdrop
- Same as mainnet

**Mainnet:**
- Real SOL
- Purchase from exchange
- Production ready

## 📚 Resources

- [n8n Docs](https://docs.n8n.io/)
- [Example Workflows](https://github.com/YOUR_USERNAME/n8n-nodes-solana-x402-client/tree/main/examples)
- [x402 Protocol](https://x402.org/)

## 🎯 Requirements

- n8n: v0.220.0+
- Node.js: v18+
- SOL balance for payments

## 📄 License

MIT

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## 💬 Support

- [GitHub Issues](https://github.com/blockchain-hq/x402-n8n-client-node/issues)
- [n8n Community](https://community.n8n.io/)

---

**⭐ Star if useful!**