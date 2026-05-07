---
name: Mercado Pago Agent Toolkit
slug: mercadopago-agent-toolkit
description: A Next.js app where an agent drives Mercado Pago billing flows (Subscriptions, Payments, Refunds, Cuotas) via @ar-agents/mercadopago tools, Vercel AI SDK 6, and AI Gateway.
framework: Next.js
useCase:
  - AI
  - Edge Functions
  - Agents
css: CSS Modules
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fmercadopago-agent-toolkit&project-name=mercadopago-agent-toolkit&repository-name=mercadopago-agent-toolkit&env=MP_ACCESS_TOKEN,AI_GATEWAY_API_KEY,NEXT_PUBLIC_BACK_URL&envDescription=API%20keys%20needed%20to%20run%20the%20agent&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fmercadopago-agent-toolkit%23environment-variables
demoUrl: https://ar-agents.vercel.app
---

# Mercado Pago Agent Toolkit

A Next.js app where an agent drives [Mercado Pago](https://www.mercadopago.com.ar/developers) billing flows via [`@ar-agents/mercadopago`](https://www.npmjs.com/package/@ar-agents/mercadopago) tools, [Vercel AI SDK 6](https://ai-sdk.dev/), and [AI Gateway](https://vercel.com/docs/ai-gateway).

The agent picks the right tool from a natural-language prompt:

- "Cobrale $25.000 mensual a juan@example.com con razón Plan Pro." → `create_subscription` returns an `init_point_url` you send to the customer.
- "Buscá pagos de los últimos 30 días por más de $5.000." → `search_payments` with date + amount filters.
- "Reembolsame el último pago de juan@example.com." → confirms then calls `refund_payment`.

## Demo

[ar-agents.vercel.app](https://ar-agents.vercel.app)

## How it works

`@ar-agents/mercadopago` ships 89 typed tools across the agent-relevant Mercado Pago API surface (Subscriptions, Payments, Checkout Pro, Marketplace OAuth, Order Management, Customers, Cards, Cuotas, QR, 3DS, Point devices, Stores+POS, Account/Balance/Settlements, Webhooks, Disputes, Lookups, Bank Accounts).

The example wires those tools into `streamText` from `ai`, picks `anthropic/claude-sonnet-4-6` via the AI Gateway (so the Anthropic key never reaches the client), and renders the result with `useChat` from `@ai-sdk/react`.

```ts
// app/api/agent/route.ts
const client = new MercadoPagoClient({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const tools = mercadoPagoTools(client, {
  state: new InMemoryStateAdapter(),
  backUrl: process.env.NEXT_PUBLIC_BACK_URL!,
});

const result = streamText({
  model: "anthropic/claude-sonnet-4-6",
  messages: await convertToModelMessages(messages),
  tools,
  stopWhen: stepCountIs(8),
});
```

Every `POST` against the Mercado Pago API gets an auto-generated idempotency key, so retries do not double-charge. Webhook signature verification (HMAC plus 5-minute replay window), circuit breaker, deadline propagation, and OpenTelemetry instrumentation are available in the same package via subpath imports.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Where to get it |
| --- | --- | --- |
| `MP_ACCESS_TOKEN` | yes | [Mercado Pago dev panel](https://www.mercadopago.com.ar/developers/panel/app). Use a `TEST-` token for sandbox. |
| `AI_GATEWAY_API_KEY` | yes | [Vercel AI Gateway](https://vercel.com/dashboard/ai-gateway). Required so the LLM call routes through the Gateway and the Anthropic key is never bundled. |
| `NEXT_PUBLIC_BACK_URL` | yes | An HTTPS URL where MP redirects buyers after the first payment. In dev, use a stable tunnel (ngrok, cloudflared, etc.). |

## Run locally

```bash
pnpm install
cp .env.example .env.local
# fill in the env vars above
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), pick a suggested prompt, and watch the agent drive the flow.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fmercadopago-agent-toolkit&project-name=mercadopago-agent-toolkit&repository-name=mercadopago-agent-toolkit&env=MP_ACCESS_TOKEN,AI_GATEWAY_API_KEY,NEXT_PUBLIC_BACK_URL)

## Learn more

- [`@ar-agents/mercadopago` README](https://github.com/ar-agents/ar-agents/blob/main/packages/mercadopago/README.md)
- [`@ar-agents/mercadopago` AGENTS.md](https://github.com/ar-agents/ar-agents/blob/main/packages/mercadopago/AGENTS.md): tool decision tree, result schemas, error patterns
- [Cookbook](https://github.com/ar-agents/ar-agents/tree/main/packages/mercadopago/cookbook): 9 production recipes (Checkout Pro, SaaS subscription, webhook handler, marketplace OAuth, QR in-store, 3DS challenge, manual capture, recovery patterns, OpenTelemetry)
- [Vercel AI SDK](https://ai-sdk.dev)
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
