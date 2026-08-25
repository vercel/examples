# Usage

Full request lifecycle when an agent hits this deployment.

## Detection triggers

The middleware recognises three ways an agent can ask for Markdown:

| Trigger                        | Example                                       | `source` property on the event |
| ------------------------------ | --------------------------------------------- | ------------------------------ |
| Known AI-bot UA on any URL     | `curl -A "ClaudeBot/1.0" /docs/intro`         | `ua-rewrite`                   |
| `.md` suffix on the URL        | `curl /docs/intro.md`                         | `md-suffix`                    |
| `Accept: text/markdown` header | `curl -H "Accept: text/markdown" /docs/intro` | `accept-header`                |

URLs without a pre-built mirror (anything outside `/docs/`) get a synthesised pointer document instead of a 404, so the contract still holds — `source` becomes `accept-header-synthesized`.

## Event shape

Every Markdown fetch fires one event into PostHog:

```jsonc
{
  "event": "doc_view",
  "distinct_id": "anon_7f3a1b2c",
  "timestamp": "2026-04-19T08:30:00.000Z",
  "properties": {
    "$process_person_profile": false,
    "$current_url": "https://your-deployment.vercel.app/docs/usage",
    "path": "/docs/usage",
    "user_agent": "ClaudeBot/1.0 (+https://claude.ai/bot)",
    "is_ai_bot": true,
    "referer": "https://claude.ai/",
    "source": "ua-rewrite",
    "site": "starter",
  },
}
```

## Customising the content

1. **Add a slug**: create `public/md/docs/<slug>.md` with the Markdown you want agents to receive.
2. **Add a human view**: add an entry to the `DOCS` object in `app/docs/[slug]/page.tsx` so browsers get a matching HTML page.
3. **Extend coverage**: edit `resolveMirrorPath` in `middleware.ts` to cover paths outside `/docs/` (e.g. `/guides/`, `/api/`, `/blog/`).

## Configuring PostHog

Set these environment variables in your Vercel project:

- `NEXT_PUBLIC_POSTHOG_KEY` — your project API key from PostHog settings
- `NEXT_PUBLIC_POSTHOG_HOST` — either `https://us.i.posthog.com`, `https://eu.i.posthog.com`, or your own reverse-proxy domain

If `NEXT_PUBLIC_POSTHOG_KEY` is absent the middleware silently no-ops on capture — no errors, responses unaffected.

## Swapping backends

Replace the PostHog adapter in `middleware.ts` with any backend by importing `webhookAnalytics` or `customAnalytics` from `@apideck/agent-analytics`:

```ts
import { webhookAnalytics } from '@apideck/agent-analytics'

const analytics = webhookAnalytics({
  url: 'https://collector.example.com/events',
  headers: { Authorization: `Bearer ${process.env.COLLECTOR_TOKEN}` },
})
```
