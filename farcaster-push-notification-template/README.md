# Farcaster Mini App Template with WalletConnect

A production-ready Next.js template for building Farcaster Mini Apps with integrated wallet connectivity using WalletConnect (Reown AppKit) and Farcaster SDK.

## 🎯 What is This Template?

This template provides a complete foundation for building Mini Apps on the Farcaster protocol. Mini Apps are interactive applications that run within Farcaster clients (like Warpcast), offering native integration with the social network and seamless wallet connectivity.

### Key Features

- **🔐 Farcaster SDK Integration** - Full access to user context, actions, and native client features
- **💼 WalletConnect Support** - Connect wallets via Reown AppKit with Farcaster Mini App connector
- **🌐 Monad Testnet** - Pre-configured for Monad Testnet (Chain ID: 10143)
- **📱 Native Actions** - Compose casts, view profiles, add frames, and more
- **🔔 Push Notifications** - Send notifications to users who have added your Mini App
- **👤 User Context** - Access user profile data (username, FID, display name, PFP)
- **🎨 Modern UI** - Built with Tailwind CSS and responsive design
- **⚡ Next.js 14** - Latest Next.js with App Router and server components
- **🔧 TypeScript** - Full type safety throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- A Farcaster account (for testing)
- Upstash Redis account (for notifications - optional)
- Reown/WalletConnect Project ID (for wallet connections)
- Monad Testnet tokens (get from [Monad Faucet](https://faucet.monad.xyz))

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd farcaster-template-walletconnect
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Required: Your app's public URL (for local dev, use a tunnel URL)
NEXT_PUBLIC_URL=http://localhost:3000

# Optional: Reown/WalletConnect Project ID
NEXT_PUBLIC_REOWN_PROJECT_ID=your-project-id

# Optional: Upstash Redis (for notifications)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

4. **Run the development server**

```bash
pnpm dev
```

5. **Test in Warpcast**

Since Mini Apps need to run in a Farcaster client, you'll need to expose your local server:

```bash
# Using cloudflared
cloudflared tunnel --url http://localhost:3000

# Or using ngrok
ngrok http 3000
```

Update `NEXT_PUBLIC_URL` in `.env.local` with the tunnel URL, then use the [Warpcast Embed Tool](https://warpcast.com/~/developers/mini-apps/embed) to test your Mini App.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── og/              # Open Graph image generation
│   │   ├── send-notification/  # Send push notifications
│   │   └── webhook/         # Handle Farcaster webhook events
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main page with frame metadata
├── components/
│   ├── Home/                # Main app components
│   │   ├── User.tsx         # Display user context
│   │   ├── WalletActions.tsx # Wallet connection UI
│   │   ├── FarcasterActions.tsx # Farcaster SDK actions
│   │   ├── NotificationActions.tsx # Push notification demo
│   │   └── index.tsx        # Main demo component
│   ├── pages/
│   │   └── app.tsx          # App entry point with safe area handling
│   ├── farcaster-provider.tsx # Farcaster SDK context provider
│   ├── wallet-provider.tsx  # WalletConnect/Wagmi provider
│   ├── providers.tsx        # Combined providers
│   └── safe-area-container.tsx # Safe area insets for mobile
├── lib/
│   ├── constants.ts         # App constants and URLs
│   ├── kv.ts               # Redis key-value storage helpers
│   └── notifs.ts           # Notification sending utilities
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🔧 Key Components

### Farcaster Provider (`components/farcaster-provider.tsx`)

Provides access to the Farcaster Mini App SDK:

```tsx
import { useFrame } from '@/components/farcaster-provider'

function MyComponent() {
  const { context, actions, haptics } = useFrame()
  
  // Access user data
  const username = context?.user?.username
  const fid = context?.user?.fid
  
  // Use SDK actions
  actions?.composeCast({ text: 'Hello Farcaster!' })
}
```

**Available Context:**
- `context.user` - User profile data (username, FID, displayName, pfpUrl)
- `context.client` - Client information and safe area insets
- `actions` - SDK actions (composeCast, viewProfile, addMiniApp, etc.)
- `haptics` - Haptic feedback controls

### Wallet Provider (`components/wallet-provider.tsx`)

Integrates WalletConnect via Reown AppKit and Wagmi:

```tsx
import { useAccount, useConnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

function WalletButton() {
  const { isConnected, address } = useAccount()
  const { open } = useAppKit()
  
  return (
    <button onClick={() => open()}>
      {isConnected ? address : 'Connect Wallet'}
    </button>
  )
}
```

**Features:**
- Farcaster Mini App connector (for in-app wallet)
- All WalletConnect-supported wallets
- Network switching support
- Transaction signing

### User Component (`components/Home/User.tsx`)

Displays the current Farcaster user's profile information from the SDK context.

### Wallet Actions (`components/Home/WalletActions.tsx`)

Demonstrates wallet connection and disconnection with a clean UI.

### Farcaster Actions (`components/Home/FarcasterActions.tsx`)

Shows examples of available Farcaster SDK actions:
- `addMiniApp()` - Add app to user's frames
- `composeCast()` - Open cast composer
- `viewProfile()` - Show user profile
- `openUrl()` - Open external URL
- `signIn()` - Request user authentication
- `close()` - Close the Mini App

## 🔔 Push Notifications

The template includes a complete notification system:

1. **Webhook Handler** (`app/api/webhook/route.ts`)
   - Handles Farcaster webhook events
   - Stores notification details when users add your app
   - Manages notification preferences

2. **Notification Sender** (`app/api/send-notification/route.ts`)
   - Sends push notifications to users
   - Handles rate limiting
   - Validates notification details

3. **Storage** (`lib/kv.ts`)
   - Uses Upstash Redis to store notification tokens
   - Persists user notification preferences

**Setup:**
1. Get Upstash Redis credentials
2. Add to `.env.local`
3. Configure webhook URL in your Farcaster app settings
4. Users must add your Mini App to receive notifications

## 🎨 Customization

### Customizing the Mini App Embed

Edit `app/page.tsx` to customize how your app appears in feeds:

```tsx
const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.png`, // 3:2 ratio image
  button: {
    title: 'Launch My App',
    action: {
      type: 'launch_frame',
      name: 'My Mini App',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`, // 200x200px
      splashBackgroundColor: '#f7f7f7',
    },
  },
}
```

### Customizing the App UI

Edit `components/Home/index.tsx` to build your custom interface:

```tsx
export function Demo() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Your custom UI here */}
    </div>
  )
}
```

### Adding Custom Routes

Create new pages in the `app/` directory following Next.js App Router conventions.

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Farcaster:** `@farcaster/miniapp-sdk`, `@farcaster/miniapp-core`
- **Wallet:** Wagmi, Viem, Reown AppKit, `@farcaster/miniapp-wagmi-connector`
- **State Management:** TanStack Query (React Query)
- **Storage:** Upstash Redis (for notifications)
- **Linting:** Biome

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The template works with any Node.js hosting platform. Ensure:
- Node.js 18+ is available
- Environment variables are set
- The app URL is publicly accessible

## 🌐 Monad Testnet Configuration

This template is pre-configured for **Monad Testnet**:

- **Chain ID:** 10143
- **RPC URL:** https://testnet-rpc.monad.xyz
- **Currency Symbol:** MON
- **Block Explorers:**
  - [MonadVision](https://testnet.monadvision.com)
  - [Monadscan](https://testnet.monadscan.com)
- **Faucet:** [Get testnet tokens](https://faucet.monad.xyz)

The network configuration is defined in `components/wallet-provider.tsx`. To switch to a different network, modify the chain definition in that file.

## 📚 Resources

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Reown AppKit Documentation](https://docs.reown.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Monad Testnet Documentation](https://docs.monad.xyz/developer-essentials/testnets)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

---

**Built with ❤️ for the Farcaster ecosystem**
