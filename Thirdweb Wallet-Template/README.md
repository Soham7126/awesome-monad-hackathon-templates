# Thirdweb Connect Wallet (Next.js App Router)

Developer docs for the Thirdweb wallet connection template built with Next.js App Router.

## Overview

This project renders a wallet connect UI using Thirdweb React v4 (`ConnectWallet`) and configures supported wallets through `ThirdwebProvider`.

## Tech Stack

- Next.js 13 (App Router)
- React 18
- `@thirdweb-dev/react` v4
- `ethers` v5

## Prerequisites

- Node.js 18+ recommended
- npm or yarn
- A Thirdweb Client ID

## Environment Setup

1. Create local env file:

```bash
cp .env.example .env.local
```

2. Set this value in `.env.local`:

```bash
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id
```

Get your client ID from the Thirdweb dashboard.

## Install and Run

Using npm:

```bash
npm install
npm run dev
```

Using yarn:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
app/
  globals.css          # global styles
  layout.js            # root layout + metadata + provider mount
  page.js              # home page (ConnectWallet UI)
  page.module.css      # page-level styles
  providers.js         # ThirdwebProvider configuration
public/
  favicon.ico
  github.png
  thirdweb.svg
.env.example
```

## Key Configuration

### Thirdweb Provider

Edit `app/providers.js` to customize:

- `activeChain` (currently `ethereum`)
- `supportedWallets` list
- client ID env variable

### Connect Wallet UI

Edit `app/page.js` to customize `ConnectWallet` props (theme, button labels, modal behavior, etc.).

## Build and Production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Notes

- `ConnectWallet` and `ThirdwebProvider` run in client components (`'use client'`).
- Keep secrets out of source control; only expose public env vars prefixed with `NEXT_PUBLIC_`.

## Useful Links

- Thirdweb React v4 docs: https://portal.thirdweb.com/react/v4
- ConnectWallet docs: https://portal.thirdweb.com/react/v4/components/ConnectWallet
- Next.js App Router docs: https://nextjs.org/docs/app
