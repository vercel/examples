// Runs INSIDE the sandbox. A Vercel AI SDK agent whose ONLY tool is the `browse`
// CLI; the browser runs remotely on Browserbase. No custom browser tool needed —
// the agent just shells out `browse <args>`.
import { generateText, tool, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { execSync } from 'node:child_process';
import { z } from 'zod';

const SESSION = 'agent';
const TASK = process.env.TASK ||
  'Go to Hacker News and find the most controversial post from today, then read the top 3 comments and summarize the debate.';

const run = (args) => {
  try {
    return execSync(`browse ${args} --session ${SESSION}`, {
      encoding: 'utf8', timeout: 45000, killSignal: 'SIGKILL',
      env: process.env, stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch (e) { return `ERROR: ${(e.stdout || '') + (e.stderr || e.message || '')}`.slice(0, 400); }
};

const system = `You drive a REAL web browser by running the browse CLI in a shell (the browser runs remotely on Browserbase).
Each tool call runs: browse <your args> --session ${SESSION}
Commands:
  open <url> --remote   # navigate (ALWAYS include --remote so it uses the cloud browser)
  get markdown body     # read a page as markdown (keeps links/URLs)
  get text body         # read a page as PLAIN TEXT (cleaner for reading comment threads)

Plan (be efficient, ~6 calls):
1. open https://news.ycombinator.com --remote, then "get markdown body" ONCE — the front page lists ~30 stories, each with points and an "N comments" link to https://news.ycombinator.com/item?id=NNNN. (Use markdown here because it contains the item URLs.)
2. Pick the most controversial = highest comment count (and/or a divisive topic). Take its exact item URL from the markdown.
3. open that item URL --remote, then "get text body" to read the post + comments. (Use TEXT here — HN comment pages are unreadable as markdown.)
4. Write a concise summary of the debate from the top 3 comments.

Rules:
- If a page returns ERROR or looks empty, DO NOT retry it — pick a DIFFERENT story.
- As soon as you've read ONE comment thread successfully, STOP browsing and write the summary.
- Use exact item URLs from the markdown; never guess ids.`;

const result = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  stopWhen: stepCountIs(20),
  system,
  prompt: TASK,
  tools: {
    browse: tool({
      description: 'Run a browse CLI command (omit leading "browse"). e.g. open https://news.ycombinator.com --remote ; get markdown body ; get text body',
      inputSchema: z.object({ args: z.string() }),
      execute: async ({ args }) => {
        process.stdout.write(`-> browse ${args}\n`);
        const out = run(args);
        process.stdout.write(`   <- ${out.length} chars${out.startsWith('ERROR') ? ' [ERR]' : ''}\n`);
        return out.slice(0, 22000);
      },
    }),
  },
});

console.log('\n===== FINAL ANSWER =====\n' + (result.text || '(empty)') + `\n\n(steps: ${result.steps.length})`);
run('stop');
