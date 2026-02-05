# Monad Portfolio Viewer - Developer Guide

A comprehensive Next.js template for building a cryptocurrency portfolio viewer on the Monad blockchain. This template demonstrates how to integrate Moralis API for token data, Reown AppKit for wallet connectivity, and provides a modern, responsive UI for displaying wallet balances.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Component Documentation](#-component-documentation)
- [API Documentation](#-api-documentation)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)

## ✨ Features

- **🔌 Wallet Connection**: Connect wallets using Reown AppKit (formerly WalletConnect)
- **🔍 Address Search**: Search and view portfolio for any Monad address without connecting a wallet
- **💰 Token Balances**: View all ERC20 token balances with real-time data
- **💵 Price Data**: Display USD prices and portfolio values
- **🌐 Network Toggle**: Switch between Monad Testnet and Mainnet
- **📱 Responsive Design**: Mobile-first, modern UI built with Tailwind CSS
- **⚡ Performance**: Optimized with React Query caching and Next.js optimizations
- **🎨 Custom Fonts**: Beautiful typography with Google Fonts integration
- **🔒 Type Safe**: Full TypeScript support for better DX

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Wallet**: Reown AppKit + Wagmi + Viem
- **Data Fetching**: TanStack React Query
- **API**: Moralis Web3 Data API
- **UI Components**: Custom components (Button, Card, etc.)
- **Fonts**: Google Fonts (Montserrat, Orbitron, Anonymous Pro, etc.)

## 📁 Project Structure

```
monad-portfolio-viewer-using-moralis-api/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── wallet/
│   │   │       └── balances/
│   │   │           └── route.ts          # API route for fetching token balances
│   │   ├── globals.css                   # Global styles and CSS variables
│   │   ├── layout.tsx                    # Root layout with providers
│   │   └── page.tsx                      # Main page component
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx                # App header with navigation
│   │   ├── portfolio/
│   │   │   ├── PortfolioDashboard.tsx    # Main dashboard component
│   │   │   ├── TokenList.tsx             # Token list container
│   │   │   └── tokens/
│   │   │       └── TokenRow.tsx          # Individual token row component
│   │   ├── ui/
│   │   │   ├── Button.tsx                # Reusable button component
│   │   │   ├── Card.tsx                  # Card component
│   │   │   ├── ConnectIcon.tsx           # Wallet connection icon
│   │   │   ├── NetworkToggle.tsx         # Network switcher component
│   │   │   └── SearchBar.tsx             # Address search component
│   │   └── wallet/
│   │       └── ConnectButton.tsx         # Wallet connect/disconnect button
│   ├── context/
│   │   ├── index.tsx                     # Wallet context provider
│   │   └── NetworkContext.tsx            # Network state management
│   ├── hooks/
│   │   └── useTokenBalances.ts           # Custom hook for token data
│   ├── lib/
│   │   └── utils.ts                      # Utility functions (cn helper)
│   └── config.ts                         # Wagmi adapter configuration
├── .env.local                            # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Moralis API Key** ([Get it here](https://admin.moralis.com/))
- **Reown Project ID** ([Get it here](https://cloud.reown.com/))

### Installation

1. **Clone or use this template**

```bash
# If cloning
git clone <repository-url>
cd monad-portfolio-viewer-using-moralis-api

# Or use as template
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Moralis API Key (server-side only)
MORALIS_API_KEY=your_moralis_api_key_here

# Reown Project ID (client-side accessible)
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here
```

**Getting Your Credentials:**

- **Moralis API Key**: 
  1. Sign up at [Moralis Dashboard](https://admin.moralis.com/)
  2. Navigate to Settings → API Keys
  3. Copy your API Key

- **Reown Project ID**:
  1. Sign up at [Reown Cloud](https://cloud.reown.com/)
  2. Create a new project
  3. Copy your Project ID

4. **Run the development server**

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Architecture

### Data Flow

```
User Action → Component → Hook → API Route → Moralis API
                ↓
         React Query Cache
                ↓
         Component Update
```

### Key Concepts

1. **Server-Side API Route**: Protects your Moralis API key by handling requests server-side
2. **React Query**: Manages data fetching, caching, and state synchronization
3. **Context Providers**: Manage wallet connection and network state globally
4. **Custom Hooks**: Encapsulate data fetching logic for reusability

## 📖 Component Documentation

### Wallet Connection (`src/context/index.tsx`)

The main context provider that sets up wallet connectivity:

```typescript
// Wraps the app with:
- WagmiProvider: Provides Wagmi configuration
- QueryClientProvider: Provides React Query client
- NetworkProvider: Manages network state
```

**Key Features:**
- Initializes Reown AppKit modal
- Configures Monad network support
- Provides wallet connection context

### Network Context (`src/context/NetworkContext.tsx`)

Manages network selection (Testnet/Mainnet):

```typescript
const { network, setNetwork, chainId } = useNetwork();

// network: "testnet" | "mainnet"
// chainId: "143" (testnet) | "monad" (mainnet)
```

**Features:**
- Persists network selection in localStorage
- Provides chain ID for API calls
- Automatically updates when network changes

### Portfolio Dashboard (`src/components/portfolio/PortfolioDashboard.tsx`)

Main dashboard component that orchestrates the portfolio view:

```typescript
// Handles:
- Wallet connection state
- Address search functionality
- Token balance fetching
- Loading and error states
- Network-aware data fetching
- Switching between connected wallet and searched address
```

**Features:**
- Search bar for viewing any address portfolio
- Works without wallet connection
- Shows current address being viewed
- Quick switch between searched address and connected wallet

**Props:** None (uses hooks internally)

### Token List (`src/components/portfolio/TokenList.tsx`)

Displays the list of tokens with loading/error states:

```typescript
<TokenList
  tokens={Token[]}
  isLoading={boolean}
  error={string | undefined}
  showLowValueTokens={boolean}
/>
```

**Features:**
- Loading skeleton
- Error display with helpful messages
- Empty state handling
- Token filtering (low value tokens)

### Token Row (`src/components/portfolio/tokens/TokenRow.tsx`)

Individual token display component:

```typescript
<TokenRow token={Token} />
```

**Displays:**
- Token logo (with fallback)
- Token name and symbol
- USD price
- Token amount
- USD value

### Network Toggle (`src/components/ui/NetworkToggle.tsx`)

Toggle button for switching between networks:

```typescript
<NetworkToggle />
```

**Features:**
- Visual indication of active network
- Smooth transitions
- Persists selection

### Search Bar (`src/components/ui/SearchBar.tsx`)

Address search component for viewing any wallet's portfolio:

```typescript
<SearchBar
  onSearch={(address: string) => void}
  placeholder?: string
/>
```

**Features:**
- Ethereum address validation (0x + 40 hex characters)
- Search on Enter key or button click
- Clear button (X icon)
- Error messages for invalid addresses
- Works independently of wallet connection

**Props:**
- `onSearch`: Callback function called with validated address
- `placeholder`: Optional placeholder text (default: "Search wallet address...")

### Connect Button (`src/components/wallet/ConnectButton.tsx`)

Custom wallet connection button:

```typescript
<ConnectButton />
```

**States:**
- Disconnected: Shows "Connect Wallet" button
- Connected: Shows address with link to explorer + disconnect button

## 🔌 API Documentation

### GET `/api/wallet/balances`

Fetches token balances for a wallet address.

**Query Parameters:**
- `address` (required): Wallet address (0x format)
- `chain` (required): Chain identifier (`143` for testnet, `monad` for mainnet)

**Example Request:**
```bash
GET /api/wallet/balances?address=0x...&chain=143
```

**Response:**
```json
[
  {
    "token_address": "0x...",
    "name": "Token Name",
    "symbol": "SYMBOL",
    "logo": "https://...",
    "decimals": 18,
    "balance": "1000000000000000000",
    "usd_price": 1.5,
    "usd_value": 1.5
  }
]
```

**Error Responses:**
- `400`: Missing address or chain parameter
- `500`: Moralis API error or server error

## 🎨 Customization

### Changing Networks

To add support for other networks, update `src/config.ts`:

```typescript
import { yourChain } from "@reown/appkit/networks";

export const wagmiAdapter = new WagmiAdapter({
  networks: [yourChain],
  transports: {
    [yourChain.id]: http(),
  },
});
```

Update `src/context/NetworkContext.tsx` to add new network options:

```typescript
type Network = "mainnet" | "testnet" | "yournetwork";

const chainId = network === "mainnet" 
  ? "monad" 
  : network === "testnet" 
    ? "143" 
    : "your-chain-id";
```

### Customizing Styles

The app uses CSS variables for theming. Edit `src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --background: 0 0% 100%;
  /* ... */
}
```

### Adding Features

**NFT Display:**
```typescript
// Create src/hooks/useNFTs.ts
export function useNFTs(address?: string) {
  // Fetch NFTs from Moralis NFT API
}
```

**Transaction History:**
```typescript
// Create src/hooks/useTransactions.ts
export function useTransactions(address?: string) {
  // Fetch transactions from Moralis
}
```

**Enhanced Search:**
```typescript
// Add ENS name resolution
// Add address book/favorites
// Add search history
```

### Container Width

The `.w-container` class provides consistent width:

```css
.w-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem; /* Responsive */
}
```

## 🐛 Troubleshooting

### Common Issues

**1. "MORALIS_API_KEY is not set"**
- ✅ Check `.env.local` exists in root directory
- ✅ Verify variable name is exactly `MORALIS_API_KEY`
- ✅ Restart dev server after adding env vars

**2. "NEXT_PUBLIC_PROJECT_ID is not set"**
- ✅ Ensure variable starts with `NEXT_PUBLIC_`
- ✅ Check `.env.local` file
- ✅ Restart dev server

**3. Wallet Connection Fails**
- ✅ Check Reown Project ID is correct
- ✅ Verify wallet extension is installed
- ✅ Check browser console for errors
- ✅ Ensure Monad network is added to wallet

**4. No Tokens Displayed**
- ✅ Verify wallet has tokens on selected network
- ✅ Check network toggle (testnet vs mainnet)
- ✅ Check browser console for API errors
- ✅ Verify Moralis API key has proper permissions

**5. "chain must be a valid enum value"**
- ✅ Ensure using correct chain IDs:
  - Testnet: `143`
  - Mainnet: `monad`
- ✅ Check NetworkContext is providing correct chainId

**6. Images Not Loading**
- ✅ Check `next.config.ts` has image domains configured
- ✅ Some tokens may not have logos (fallback displays first letter)
- ✅ Check browser console for CORS errors

### Debug Mode

Enable React Query devtools for debugging:

```typescript
// Add to src/context/index.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Add inside ContextProvider
<ReactQueryDevtools initialIsOpen={false} />
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Add Environment Variables**
   - `MORALIS_API_KEY`: Your Moralis API key
   - `NEXT_PUBLIC_PROJECT_ID`: Your Reown Project ID

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Other Platforms

**Netlify:**
```bash
# Build command
npm run build

# Publish directory
.next
```

**Railway/Render:**
- Set build command: `npm run build`
- Set start command: `npm start`
- Add environment variables in dashboard

### Environment Variables

**Required for Production:**
- `MORALIS_API_KEY`: Server-side API key
- `NEXT_PUBLIC_PROJECT_ID`: Client-side project ID

**Security Notes:**
- ✅ Never commit `.env.local` to git
- ✅ Use platform-specific env var management
- ✅ `MORALIS_API_KEY` should never be exposed client-side
- ✅ `NEXT_PUBLIC_*` variables are exposed to browser

## 📚 Additional Resources

- **[Moralis API Docs](https://docs.moralis.com/web3-data-api/evm)** - Complete API reference
- **[Reown AppKit Docs](https://docs.reown.com/appkit)** - Wallet connection guide
- **[Monad Docs](https://docs.monad.xyz/)** - Monad blockchain documentation
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js framework guide
- **[Wagmi Docs](https://wagmi.sh)** - Ethereum React Hooks
- **[React Query Docs](https://tanstack.com/query)** - Data fetching library

## 🔍 Using the Search Feature

The portfolio viewer includes a powerful search feature that allows you to view any address's portfolio:

### Search Any Address

1. **Without Wallet Connection:**
   - Enter any Monad address in the search bar
   - Click "Search" or press Enter
   - View the portfolio for that address

2. **With Wallet Connected:**
   - Default view shows your connected wallet
   - Search for other addresses to view their portfolios
   - Click "View my wallet instead" to return to your wallet

### Address Validation

- Validates Ethereum address format (0x followed by 40 hexadecimal characters)
- Shows error message for invalid addresses
- Only searches when address format is correct

### Example Usage

```typescript
// Search bar automatically validates addresses
// Valid: 0xdAF0182De86F904918Db8d07c7340A1EfcDF8244
// Invalid: 0x123 (too short)
// Invalid: dAF0182De86F904918Db8d07c7340A1EfcDF8244 (missing 0x)
```

## 🎯 Best Practices

1. **API Key Security**: Always keep `MORALIS_API_KEY` server-side only
2. **Error Handling**: Always handle API errors gracefully
3. **Loading States**: Show loading indicators for better UX
4. **Caching**: Leverage React Query caching to reduce API calls
5. **Type Safety**: Use TypeScript types for all data structures
6. **Responsive Design**: Test on multiple screen sizes
7. **Performance**: Use Next.js Image component for token logos
8. **Address Validation**: Always validate addresses before making API calls

## 📝 License

This template is provided as-is for educational and development purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Important Notes

- **Rate Limits**: Moralis free tier has rate limits - implement caching
- **API Costs**: Monitor your Moralis API usage
- **Network Support**: Verify Monad network support in Moralis
- **Token Logos**: Some tokens may not have logos available
- **Price Data**: Prices may have slight delays (30s cache)

---

**Built with ❤️ for the Monad ecosystem**

**Happy Building! 🚀**
