---
name: eve + Pay.sh Agent
slug: eve-pay-agent
description: An approval-gated eve agent that inspects and pays for sandbox API access with Pay.sh.
framework: Other
useCase:
  - AI
  - Web3
  - Starter
css: None
githubUrl: https://github.com/vercel/examples/tree/main/starter/eve-pay-agent
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/eve-pay-agent&project-name=eve-pay-agent&repository-name=eve-pay-agent
demoUrl: https://eve-pay-agent.vercel.app
relatedTemplates:
  - eve-chat-template
---

# eve + Pay.sh Agent

An [eve](https://eve.dev) agent that inspects an HTTP 402 challenge, pauses for approval, and uses [Pay.sh](https://pay.sh) to buy a sandbox stock quote.

The example has two tools:

- `inspect_stock_quote` reads the payment terms without signing or paying.
- `buy_stock_quote` requires approval, revalidates every approved field, and runs the pinned Pay.sh CLI in an isolated eve sandbox.

Pay.sh uses an ephemeral sandbox account on `localnet`. The agent cannot access a user wallet or mainnet funds.

## Demo

https://eve-pay-agent.vercel.app

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/eve-pay-agent&project-name=eve-pay-agent&repository-name=eve-pay-agent)

Vercel OIDC authenticates AI Gateway automatically when deployed. An AI Gateway API key is only needed for local development without OIDC.

## Run locally

Requires Node.js 24+ and Docker.

```bash
pnpm install
cp .env.example .env.local
# Add AI_GATEWAY_API_KEY to .env.local
pnpm dev
```

Then ask:

```text
Get a paid sandbox quote for AAPL.
```

eve shows the amount, USDC mint, recipient, and network before pausing. Approve only after checking those fields. Denying the request skips the Pay.sh call.

You can use Vercel OIDC instead of a local Gateway key:

```bash
vercel link
vercel env pull
```

## How it works

1. `inspect_stock_quote` requests the fixed Pay.sh debugger endpoint and parses its HTTP 402 challenge.
2. eve presents the exact payment terms and pauses at its durable approval gate.
3. After approval, `buy_stock_quote` fetches fresh terms and stops if any field changed.
4. Pay.sh creates an ephemeral sandbox account, signs the local test payment, and returns the quote.

The shell, filesystem, and web tools are disabled so the agent cannot bypass the payment tool's approval gate.

## Security

This example is limited to the fixed Pay.sh debugger endpoint and sandbox funds. It never reads a wallet, seed phrase, or private key. The pinned Pay.sh CLI runs only after approval and only with `--sandbox`.

This sandbox demo rechecks the displayed terms before handing off to Pay.sh. Production code must bind the signer to the exact approved challenge or enforce hard client-side limits in the signing path.

For real payments, use a reviewed custody design and keep the same boundaries: explicit approval or a reviewed spending policy, endpoint and amount limits, idempotency, pre-signing simulation, on-chain confirmation, and managed signing authority.

Read the [Pay.sh client guide](https://pay.sh/docs/get-started/client-quickstart) and [eve approval guide](https://eve.dev/docs/human-in-the-loop) before adapting the example.
