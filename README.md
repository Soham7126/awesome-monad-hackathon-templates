# Awesome Monad Hackathon Templates

A collection of production-ready templates for building on the Monad blockchain. These templates provide complete implementations for common Web3 use cases, helping developers quickly bootstrap their Monad projects.

## 📋 Table of Contents

- [Templates](#-templates)
  - [Portfolio Viewer](#1-portfolio-viewer-using-moralis-api)
  - [Token Swaps (Kuru Flow)](#2-token-swaps-using-kuru-flow)
  - [x402 Payment Protocol](#3-x402-payment-protocol)
  - [Oracle Integration](#4-oracle-integration-hardhat)
  - [Token Tracker (Envio)](#5-token-tracker-envio-indexer)
  - [Farcaster Push Notifications](#6-farcaster-push-notifications)
  - [Smart Wallet (Privy)](#7-smart-wallet-privy)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)

## 🚀 Templates

### 1. Portfolio Viewer Using Moralis API

**Template Name:** `monad-portfolio-viewer-using-moralis-api`

**Introduction:**
A comprehensive Next.js template for building a cryptocurrency portfolio viewer on the Monad blockchain. This template demonstrates how to integrate Moralis API for token data, Reown AppKit for wallet connectivity, and provides a modern, responsive UI for displaying wallet balances.

**Key Features:**
- 🔌 Wallet connection using Reown AppKit
- 🔍 Address search - view any wallet's portfolio without connecting
- 💰 Real-time token balances and USD values
- 🌐 Network toggle (Testnet/Mainnet)
- 📱 Responsive design with custom fonts
- ⚡ Optimized with React Query caching

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Moralis API, Reown AppKit, Wagmi

**Template URL:** [`monad-portfolio-viewer-using-moralis-api/`](./monad-portfolio-viewer-using-moralis-api/)

**Documentation:** [Full README](./monad-portfolio-viewer-using-moralis-api/README.md)

---

### 2. Token Swaps Using Kuru Flow

**Template Name:** `monad-add swaps to your app using Kuru-template`

**Introduction:**
A production-ready Next.js template for integrating token swaps on Monad blockchain using the Kuru Flow API. This template provides a complete swap interface with wallet connection, quote fetching, and transaction execution, perfect for building DeFi applications on Monad.

**Key Features:**
- 💱 Token swap interface with real-time quotes
- 🪙 Native MON support (swap without wrapping)
- 🔗 Wallet integration via Reown AppKit
- 💵 Referral fee system
- 🔐 JWT authentication
- 📊 Transaction tracking

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Kuru Flow API, Reown AppKit

**Template URL:** [`monad-add swaps to your app using Kuru-template/`](./monad-add%20swaps%20to%20your%20app%20using%20Kuru-template/)

**Documentation:** [Full README](./monad-add%20swaps%20to%20your%20app%20using%20Kuru-template/README.md)

**Live Demo:** [example-repo-kuru-flow.vercel.app](https://example-repo-kuru-flow.vercel.app)

---

### 3. x402 Payment Protocol

**Template Name:** `monad-x402-template`

**Introduction:**
A Next.js template demonstrating the x402 Payment Protocol using Thirdweb Facilitator on Monad Testnet. This template provides a complete implementation of HTTP 402 Payment Required, enabling pay-per-use API endpoints with seamless crypto payments.

**Key Features:**
- 💳 Complete x402 protocol implementation
- 🔄 Thirdweb Facilitator integration
- 🌐 Monad Testnet support
- 📝 Interactive demo UI with real-time logging
- 🔐 Wallet integration and payment signing

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Thirdweb, x402 Protocol

**Template URL:** [`monad-x402-template/`](./monad-x402-template/)

**Documentation:** [Full README](./monad-x402-template/README.md)

**Learn More:** [x402 Protocol Specification](https://www.x402.org/)

---

### 4. Oracle Integration (Hardhat)

**Template Name:** `monad-oracles-hardhat-template`

**Introduction:**
A comprehensive Hardhat template for integrating all oracles supported by Monad blockchain. This template provides ready-to-use contracts and scripts for deploying and interacting with multiple oracle providers.

**Supported Oracles:**
- 📊 Chronicle Oracle
- 🐍 Pyth Network
- 🔴 Redstone Oracle
- 🦅 Stork Oracle
- 🔄 Switchboard

**Key Features:**
- 📦 Multiple oracle provider support
- 🔧 Ready-to-use contracts and scripts
- 📝 Comprehensive deployment guides
- 🧪 Testing utilities
- 📚 Detailed documentation for each oracle

**Tech Stack:** Hardhat, Solidity, TypeScript, Ethers.js

**Template URL:** [`monad-oracles-hardhat-template/`](./monad-oracles-hardhat-template/)

**Documentation:** [Full README](./monad-oracles-hardhat-template/README.md)

---

### 5. Token Tracker (Envio Indexer)

**Template Name:** `Monad-Envio-token-tracker-template`

**Introduction:**
A production-ready Envio indexer template for tracking ERC20 tokens and pools on the Monad blockchain. This template indexes token creation events, extracts token metadata (name, symbol, decimals), and stores them in a queryable GraphQL database.

**Key Features:**
- 📡 Real-time blockchain event indexing
- 🗄️ GraphQL database for querying
- 🔍 Token metadata extraction
- 🏊 Pool tracking (Uniswap V3 compatible)
- ⚡ Fast and efficient indexing

**Tech Stack:** Envio, GraphQL, TypeScript, Solidity

**Template URL:** [`Monad-Envio-token-tracker-template/`](./Monad-Envio-token-tracker-template/)

**Documentation:** [Full README](./Monad-Envio-token-tracker-template/README.md)

**Learn More:** [Envio Documentation](https://docs.envio.dev)

---

### 6. Farcaster Push Notifications

**Template Name:** `farcaster-push-notification-template`

**Introduction:**
A production-ready Next.js template for building Farcaster Mini Apps with integrated wallet connectivity and push notifications. This template demonstrates how to create interactive applications that run within Farcaster clients (like Warpcast), offering native integration with the social network and seamless wallet connectivity on Monad blockchain.

**Key Features:**
- 🔐 Farcaster SDK integration with full user context access
- 💼 WalletConnect support via Reown AppKit with Farcaster Mini App connector
- 🌐 Monad Testnet pre-configured (Chain ID: 10143)
- 📱 Native Farcaster actions (compose casts, view profiles, add frames)
- 🔔 Push notification system for users who add your Mini App
- 👤 User context access (username, FID, display name, PFP)
- 🎨 Modern UI with Tailwind CSS and responsive design
- ⚡ Next.js 14 with App Router and server components

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Farcaster SDK, Reown AppKit, Wagmi, Upstash Redis

**Template URL:** [`farcaster-push-notification-template/`](./farcaster-push-notification-template/)

**Documentation:** [Full README](./farcaster-push-notification-template/README.md)

**Learn More:** [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/)

---

### 7. Smart Wallet (Privy)

**Template Name:** `Smart-Wallet-Privy-Template`

**Introduction:**
A production-ready Next.js template for using smart wallets with Privy Auth on Monad Testnet. This template demonstrates how to integrate Privy's smart wallet functionality, enabling seamless user onboarding and transaction execution without requiring users to manage private keys. Perfect for building user-friendly Web3 applications with embedded wallets.

**Key Features:**
- 🔐 Smart wallet integration with automatic wallet creation via Privy
- 💼 Embedded wallets - no browser extensions required
- 🔄 Batch transaction support - execute multiple transactions in a single batch
- 📝 Complete transaction examples (minting NFTs, approvals, batch operations)
- 🌐 Monad Testnet pre-configured (Chain ID: 10143)
- 🔒 Server-side authentication with secure token verification
- 📱 Responsive design with modern UI and custom graphics
- ⚡ TypeScript for full type safety

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Privy Auth, Privy Smart Wallets, Viem

**Template URL:** [`Smart-Wallet-Privy-Template/`](./Smart-Wallet-Privy-Template/)

**Documentation:** [Full README](./Smart-Wallet-Privy-Template/README.md)

**Learn More:** [Privy Documentation](https://docs.privy.io/)

---

## 🎯 Getting Started

### Quick Start

1. **Choose a Template**
   - Browse the templates above and select one that fits your needs
   - Each template includes detailed documentation in its README

2. **Clone or Use Template**
   ```bash
   # Clone the entire repository
   git clone <repository-url>
   cd awesome-monad-hackathon-templates
   
   # Navigate to your chosen template
   cd monad-portfolio-viewer-using-moralis-api
   ```

3. **Follow Template-Specific Setup**
   - Each template has its own setup instructions
   - Check the template's README for prerequisites and installation steps
   - Most templates require environment variables (API keys, etc.)

4. **Start Building**
   - Customize the template to your needs
   - Deploy to your preferred platform
   - Build amazing things on Monad! 🚀

### Prerequisites

Most templates require:
- **Node.js** 18+ installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Monad Testnet** configured in your wallet (for testing)
- **API Keys** (varies by template - check individual READMEs)

## 📚 Resources

- **[Monad Documentation](https://docs.monad.xyz/)** - Official Monad blockchain docs
- **[Monad Explorer](https://monadvision.com/)** - Explore Monad blockchain
- **[Monad Testnet](https://docs.monad.xyz/developers/testnet)** - Testnet information
- **[Monad Discord](https://discord.gg/monad)** - Community support

## 🤝 Contributing

Contributions are welcome! If you have a template that would be useful for the Monad ecosystem:

1. Fork this repository
2. Create your template in a new directory
3. Add a comprehensive README
4. Submit a pull request

## 📝 License

These templates are provided as-is for educational and development purposes. Check individual template directories for specific licenses.

## ⚠️ Important Notes

- **Testnet First**: Always test on Monad Testnet before deploying to mainnet
- **API Keys**: Keep your API keys secure and never commit them to version control
- **Rate Limits**: Be aware of API rate limits for services like Moralis
- **Network Support**: Verify that all services support Monad network

---

**Built with ❤️ for the Monad ecosystem**

**Happy Building! 🎉**
