// The model is served through Vercel AI Gateway. A bare `provider/model` string
// resolves through the default Gateway provider in ai@6, authenticated by
// Vercel's OIDC token (or AI_GATEWAY_API_KEY) — so no separate Anthropic key is
// needed.
export const MODEL = 'anthropic/claude-sonnet-5'

export const DEFAULT_TASK =
  "Using Amazon (https://www.amazon.com), research the current top mechanical keyboards: search the site, then for the top 5 results compare each product's title, price, star rating, and number of ratings. Return a comparison table including each product's URL."

// Built fresh on every request (not a static export) so the injected date is
// always today — the route calls this per-request, never at module load.
export function buildSystemPrompt(): string {
  const today = new Date().toISOString().slice(0, 10)
  return `You are an autonomous deep-research agent. You have a \`browse\` CLI (Browserbase browser automation) in your bash tool — it is installed, and its auth and a shared browser session are already configured via environment variables. Learn how to use it by running \`browse skills show\` (it prints the CLI's bundled usage guide); use \`browse --help\` (and \`browse <command> --help\`) for extra detail on any command. Then complete the task.

You are running inside a Vercel Sandbox microVM with no local browser — every \`browse\` session is remote and already configured via environment variables, so never pass \`--local\`. Today's date is ${today}; use it for anything time-sensitive and never hardcode or guess a date. If you're nearing the step limit, stop navigating and give the best final answer you can from what you've already gathered.

When you cite a document, link the direct document itself, not a viewer, preview, or index page that wraps it. Return a clear, well-sourced answer.`
}
