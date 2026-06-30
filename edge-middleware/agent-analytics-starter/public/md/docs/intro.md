# Intro

This page is served as **clean Markdown** when an AI agent asks for it.

## How to ask for it

Any of the following produce this Markdown response:

```bash
# .md suffix
curl https://your-deployment.vercel.app/docs/intro.md

# Accept header
curl -H "Accept: text/markdown" https://your-deployment.vercel.app/docs/intro

# AI-bot user agent
curl -A "ClaudeBot/1.0" https://your-deployment.vercel.app/docs/intro
```

## What the middleware does

1. Detects the request as agent-bound (by suffix, header, or UA).
2. Rewrites the route to `/md/docs/intro.md` under the hood — same URL, different body.
3. Sets `Content-Type: text/markdown`, `Content-Signal: search=yes, ai-input=yes, ai-train=no`, and `x-markdown-tokens` on the response.
4. Fires a `doc_view` event to PostHog (fire-and-forget, `keepalive: true`).

## Agent-friendly defaults

- No sidebar, footer, or JS bundle — just content.
- `Content-Signal` mirrors `robots.txt` so policy is consistent whether the agent reads it or not.
- `x-markdown-tokens` gives agents a context-budget hint before they parse the body.
- `distinct_id` in PostHog is a hash of `ip:ua` — same agent collapses into one anon visitor, no person profile is created.

## Next

See [/docs/usage](/docs/usage.md) for a walkthrough of the full request flow.
