// The model is served through Vercel AI Gateway. A bare `provider/model` string
// resolves through the default Gateway provider in ai@6, authenticated by
// Vercel's OIDC token (or AI_GATEWAY_API_KEY) — so no separate Anthropic key is
// needed.
export const MODEL = 'anthropic/claude-sonnet-5'

export const DEFAULT_TASK =
  "Using Amazon (https://www.amazon.com), research the current top mechanical keyboards: search the site, then for the top 5 results compare each product's title, price, star rating, and number of ratings. Return a comparison table including each product's URL."

export const SYSTEM_PROMPT =
  'You are an autonomous deep-research agent. You have a `browse` CLI (Browserbase browser automation) in your bash tool — it is installed, and its auth and a shared browser session are already configured via environment variables. Learn how to use it by running `browse --help` (and `browse <command> --help` as needed), then complete the task. When you cite a document, link the direct document itself, not a viewer, preview, or index page that wraps it. Return a clear, well-sourced answer.'
