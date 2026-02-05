# Envio Token Tracker Template for Monad Chain

A production-ready Envio indexer template for tracking ERC20 tokens and pools on the Monad blockchain. This template indexes token creation events, extracts token metadata (name, symbol, decimals), and stores them in a queryable GraphQL database.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Querying Data](#querying-data)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This template uses [Envio](https://docs.envio.dev) to index blockchain events on Monad. It listens for pool creation events (like Uniswap V3 Factory `PoolCreated` events) and automatically extracts ERC20 token details for each token in the pool. The indexed data is stored in a GraphQL database that you can query in real-time.

### How It Works

1. **Event Listening**: The indexer monitors specified smart contract events on Monad
2. **Token Extraction**: When a pool is created, it extracts token addresses (token0 and token1)
3. **Metadata Fetching**: Uses RPC calls to fetch token name, symbol, and decimals
4. **Data Storage**: Stores token and pool information in a GraphQL database
5. **Real-time Queries**: Query your indexed data via GraphQL API

## ✨ Features

- 🔍 **Automatic Token Tracking**: Automatically discovers and tracks new tokens from pool creation events
- 📊 **Token Metadata Extraction**: Fetches name, symbol, and decimals for each token
- 🔄 **Dual ERC20 Support**: Handles both standard and bytes32-based ERC20 implementations
- ⚡ **Efficient Indexing**: Uses multicall batching for optimal RPC usage
- 🛡️ **Error Handling**: Graceful fallbacks for non-standard token implementations
- 📈 **GraphQL API**: Query your indexed data with powerful GraphQL queries
- 🔧 **Type-Safe**: Full TypeScript support with generated types

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **pnpm** package manager (`npm install -g pnpm`)
- **Monad RPC URL** (for connecting to Monad network)
- **Envio Account** (sign up at [envio.dev](https://envio.dev))

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the template
git clone <your-repo-url>
cd Envio-token-tracker-template

# Install dependencies
pnpm install
```

### 2. Configure for Monad

Edit `config.yaml` to configure the indexer for Monad chain:

```yaml
name: monad-token-tracker
networks:
  - id: 10143  # Monad chain ID (update with actual Monad chain ID)
    start_block: 0  # Starting block number
    contracts:
      - name: UniswapV3Factory  # Or your DEX factory contract name
        address:
          - 0xYourFactoryAddress  # Replace with actual factory address on Monad
        handler: src/EventHandlers.ts
        events:
          - event: PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)
```

**Note**: Update the chain ID and contract addresses according to Monad's network configuration.

### 3. Set Environment Variables

Create a `.env` file in the root directory:

```bash
RPC_URL=https://your-monad-rpc-url.com
```

### 4. Generate Code

Generate TypeScript types from your schema:

```bash
pnpm codegen
```

### 5. Run Development Server

Start the indexer in development mode:

```bash
pnpm dev
```

The indexer will start syncing blocks and indexing events. You can view logs in the terminal.

## 📁 Project Structure

```
Envio-token-tracker-template/
├── config.yaml              # Indexer configuration
├── schema.graphql           # GraphQL schema definition
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── EventHandlers.ts     # Event handler logic
│   ├── tokenDetails.ts      # Token metadata fetching
│   ├── utils.ts             # Utility functions
│   └── ERC20.json           # ERC20 ABI definition
└── generated/               # Auto-generated files (after codegen)
```

### File Explanations

#### `config.yaml`
The main configuration file that defines:
- **Indexer name**: Unique identifier for your indexer
- **Networks**: Blockchain networks to index (Monad chain configuration)
- **Contracts**: Smart contracts to monitor and their events
- **Start block**: Block number to start indexing from
- **Handlers**: TypeScript files that process events

**Key Configuration Options:**
- `id`: Chain ID for Monad network
- `start_block`: First block to index (use 0 for genesis or specific block)
- `address`: Contract addresses to monitor (can be multiple)
- `events`: List of events to index from the contract
- `preload_handlers`: Whether to preload handlers for faster startup

#### `schema.graphql`
Defines the data structure stored in your GraphQL database:

- **Token**: Stores ERC20 token information
  - `id`: Token contract address (unique identifier)
  - `name`: Token name
  - `symbol`: Token symbol
  - `decimals`: Token decimals (typically 18)

- **Pool**: Stores pool/liquidity pool information
  - `id`: Unique pool identifier
  - `token0`: Reference to Token entity
  - `token1`: Reference to Token entity
  - `fee`: Pool fee tier
  - `tickSpacing`: Tick spacing for the pool
  - `pool`: Pool contract address

#### `src/EventHandlers.ts`
Contains the event processing logic:

- **`UniswapV3Factory.PoolCreated.handler`**: Processes `PoolCreated` events
  - Creates a `Pool` entity with pool details
  - Extracts token0 and token1 addresses
  - Fetches token metadata using effects
  - Creates `Token` entities for both tokens
  - Handles errors gracefully with try-catch blocks

**Key Concepts:**
- `context.Pool.set()`: Saves pool entity to database
- `context.Token.set()`: Saves token entity to database
- `context.effect()`: Executes async operations (RPC calls)
- `context.log.warn()`: Logs warnings for debugging

#### `src/tokenDetails.ts`
Handles fetching ERC20 token metadata:

- **`getTokenDetailsEffect`**: Envio effect that fetches token details
  - Uses `viem` for RPC calls
  - Supports both standard and bytes32 ERC20 implementations
  - Uses multicall for efficient batch requests
  - Includes caching and rate limiting
  - Validates decimals (0-50 range)

**Effect Features:**
- `rateLimit: false`: No rate limiting (adjust if needed)
- `cache: true`: Caches results to avoid duplicate calls
- Fallback mechanism for non-standard tokens

#### `src/utils.ts`
Utility functions for contract interactions:

- **`getERC20Contract`**: Returns standard ERC20 contract configuration
- **`getERC20BytesContract`**: Returns bytes32-based ERC20 contract configuration

These utilities help handle different ERC20 implementations (some tokens use bytes32 for name/symbol instead of strings).

#### `src/ERC20.json`
Standard ERC20 ABI (Application Binary Interface) containing:
- Function definitions (name, symbol, decimals, balanceOf, etc.)
- Event definitions (Transfer, Approval, etc.)

This ABI is used by `viem` to interact with ERC20 contracts.

#### `package.json`
Project dependencies and scripts:

**Key Dependencies:**
- `envio`: Envio indexer framework
- `viem`: Ethereum library for RPC interactions

**Available Scripts:**
- `pnpm codegen`: Generate TypeScript types from schema
- `pnpm dev`: Run indexer in development mode
- `pnpm build`: Compile TypeScript
- `pnpm test`: Run tests

## ⚙️ Configuration

### Configuring for Monad Chain

1. **Update Chain ID**: Find Monad's chain ID and update `config.yaml`:
   ```yaml
   networks:
     - id: <MONAD_CHAIN_ID>
   ```

2. **Set Contract Addresses**: Add the addresses of contracts you want to monitor:
   ```yaml
   address:
     - 0xYourContractAddress
   ```

3. **Configure Start Block**: Set the block number to start indexing:
   ```yaml
   start_block: 0  # Or specific block number
   ```

4. **Define Events**: List all events you want to index:
   ```yaml
   events:
     - event: PoolCreated(address indexed token0, address indexed token1, ...)
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RPC_URL` | Monad RPC endpoint URL | Yes |

Example `.env`:
```bash
RPC_URL=https://rpc.monad.xyz
```

## 🛠️ Development

### Running Locally

1. **Start Development Server**:
   ```bash
   pnpm dev
   ```

2. **Watch for Changes**:
   ```bash
   pnpm watch
   ```

3. **Build Project**:
   ```bash
   pnpm build
   ```

### Adding New Event Handlers

1. Add the event to `config.yaml`:
   ```yaml
   events:
     - event: YourNewEvent(address indexed param1, uint256 param2)
   ```

2. Run codegen to generate types:
   ```bash
   pnpm codegen
   ```

3. Create handler in `src/EventHandlers.ts`:
   ```typescript
   YourContract.YourNewEvent.handler(async ({ event, context }) => {
     // Your handler logic
   });
   ```

### Testing

Run tests with:
```bash
pnpm test
```

## 🚢 Deployment

### Deploy to Envio Cloud

1. **Login to Envio**:
   ```bash
   npx envio login
   ```

2. **Deploy Indexer**:
   ```bash
   npx envio deploy
   ```

3. **Monitor Deployment**:
   Check the Envio dashboard for deployment status and logs.

### Deployment Checklist

- [ ] Updated `config.yaml` with Monad chain configuration
- [ ] Set `RPC_URL` environment variable
- [ ] Tested locally with `pnpm dev`
- [ ] Generated types with `pnpm codegen`
- [ ] Verified schema.graphql matches your data needs

## 📊 Querying Data

Once deployed, query your indexed data using GraphQL:

### Example Queries

**Get all tokens:**
```graphql
query GetAllTokens {
  Tokens {
    id
    name
    symbol
    decimals
  }
}
```

**Get pools with token details:**
```graphql
query GetPools {
  Pools {
    id
    pool
    fee
    tickSpacing
    token0 {
      name
      symbol
      decimals
    }
    token1 {
      name
      symbol
      decimals
    }
  }
}
```

**Get specific token:**
```graphql
query GetToken($address: String!) {
  Token(id: $address) {
    id
    name
    symbol
    decimals
  }
}
```

**Get pools for a token:**
```graphql
query GetTokenPools($tokenAddress: String!) {
  Pools(
    where: {
      or: [
        { token0_id: $tokenAddress }
        { token1_id: $tokenAddress }
      ]
    }
  ) {
    id
    pool
    fee
  }
}
```

Access your GraphQL endpoint from the Envio dashboard after deployment.

## 🔧 Troubleshooting

### Common Issues

**1. RPC Connection Errors**
```
Error: Failed to connect to RPC
```
- Verify `RPC_URL` is correct in `.env`
- Check if RPC endpoint is accessible
- Ensure RPC endpoint supports the required methods

**2. Token Metadata Fetching Fails**
```
failed token0 with address
```
- Token may not be a standard ERC20
- Token contract may not exist at that address
- RPC may be rate-limited (check logs)

**3. Codegen Errors**
```
Error: Schema validation failed
```
- Check `schema.graphql` syntax
- Ensure all types are properly defined
- Verify relationships between entities

**4. Handler Not Triggering**
- Verify event signature matches exactly in `config.yaml`
- Check if contract address is correct
- Ensure `start_block` is before the event occurred
- Verify contract emits the event on Monad chain

**5. Type Errors**
```
Property 'X' does not exist on type 'Y'
```
- Run `pnpm codegen` after schema changes
- Restart TypeScript server in your IDE
- Check if generated types are up to date

### Debug Tips

1. **Check Logs**: Monitor console output for warnings and errors
2. **Verify Block Range**: Ensure events exist in the block range you're indexing
3. **Test RPC Calls**: Use `viem` directly to test RPC connectivity
4. **Validate Schema**: Ensure GraphQL schema matches your data structure
5. **Check Chain ID**: Verify you're using the correct Monad chain ID

## 📚 Additional Resources

- [Envio Documentation](https://docs.envio.dev)
- [Envio Discord](https://discord.gg/envio)
- [Viem Documentation](https://viem.sh)
- [GraphQL Documentation](https://graphql.org/learn/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This template is provided as-is for use in the Monad hackathon and other projects.

---

**Happy Indexing! 🚀**

For questions or support, reach out to the Envio team or check the documentation.
