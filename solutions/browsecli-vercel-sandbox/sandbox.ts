// A bash-tool agent in a Vercel Sandbox.
//
// The agent loop runs HERE on the host (Vercel AI SDK `ToolLoopAgent`). Its
// `bash` tool — built with Vercel's `bash-tool` — executes commands INSIDE an
// ephemeral Vercel Sandbox microVM. The `browse` CLI is installed in that
// sandbox and drives a real browser running on Browserbase, so the browser
// never runs in the microVM. The model navigates the web by running `browse`
// commands through the `bash` tool.
import { Sandbox } from '@vercel/sandbox';
import { createBashTool } from 'bash-tool';
import { ToolLoopAgent, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const req = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
};

const ANTHROPIC_API_KEY = req('ANTHROPIC_API_KEY');
const BROWSERBASE_API_KEY = req('BROWSERBASE_API_KEY');
const TASK =
  process.env.TASK ||
  'Go to Hacker News and find the most controversial post from today, then read the top 3 comments and summarize the debate.';

const system = `You drive a REAL web browser by running the \`browse\` CLI through the bash tool.
The browser runs remotely on Browserbase; \`browse\` is already installed and BROWSERBASE_API_KEY is already set in the shell.
Use a single named session so commands share one browser:
  browse open <url> --remote --session agent   # navigate (ALWAYS pass --remote for the cloud browser)
  browse get markdown body --session agent      # read a page as markdown (keeps links/URLs)
  browse get text body --session agent          # read a page as PLAIN TEXT (cleaner for comment threads)

Plan (be efficient, ~6 bash calls):
1. browse open https://news.ycombinator.com --remote --session agent, then "browse get markdown body --session agent" ONCE.
   The front page lists ~30 stories, each with points and an "N comments" link to https://news.ycombinator.com/item?id=NNNN.
   Use markdown here because it contains the item URLs and comment counts.
2. Pick the most controversial = highest comment count (and/or a divisive topic). Take its exact item URL from the markdown.
3. browse open <that item URL> --remote --session agent, then "browse get text body --session agent" to read the post + comments.
   Use TEXT here — HN comment pages are unreadable as markdown.
4. Write a concise summary of the debate from the top 3 comments.

Rules:
- If a bash command errors or a page looks empty, DO NOT retry it unchanged — pick a DIFFERENT story.
- As soon as you've read ONE comment thread successfully, STOP browsing and write the summary.
- Use exact item URLs from the markdown; never guess ids.
- When finished, run "browse stop --session agent" to release the browser.`;

console.log('› Creating Vercel Sandbox (Firecracker microVM, node24)…');
// BROWSERBASE_API_KEY is passed as a default sandbox env var. Vercel stores it
// encrypted server-side and injects it into every command, so the key reaches
// the `browse` commands the bash tool runs — without ever being written to a
// committed file or echoed.
const sandbox = await Sandbox.create({
  runtime: 'node24',
  timeout: 600_000,
  token: req('VERCEL_TOKEN'),
  teamId: req('VERCEL_TEAM_ID'),
  projectId: req('VERCEL_PROJECT_ID'),
  env: { BROWSERBASE_API_KEY },
});
console.log(`› Sandbox ready: ${sandbox.name}`);

try {
  // Install the browse CLI globally inside the sandbox (bash runs there).
  console.log('› Installing the browse CLI inside the sandbox…');
  const install = await sandbox.runCommand({
    cmd: 'npm',
    args: ['install', '-g', 'browse@latest'],
    stderr: process.stderr,
  });
  if (install.exitCode !== 0) throw new Error(`browse install failed (exit ${install.exitCode})`);

  // Adapt the @vercel/sandbox instance to bash-tool's Sandbox interface
  // (executeCommand / readFile / writeFiles). bash-tool ships a built-in
  // wrapper, but its duck-typing detection doesn't recognize @vercel/sandbox
  // v2, so we pass the small explicit adapter documented in the bash-tool
  // README. `bash` executes IN the microVM; the agent loop stays on the host.
  const streamToString = async (stream: NodeJS.ReadableStream): Promise<string> => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
  };

  const adapter = {
    async executeCommand(command: string) {
      const result = await sandbox.runCommand('bash', ['-c', command]);
      const [stdout, stderr] = await Promise.all([result.stdout(), result.stderr()]);
      return { stdout, stderr, exitCode: result.exitCode };
    },
    async readFile(filePath: string) {
      const stream = await sandbox.readFile({ path: filePath });
      if (stream === null) throw new Error(`File not found: ${filePath}`);
      return streamToString(stream);
    },
    async writeFiles(files: Array<{ path: string; content: string | Buffer }>) {
      await sandbox.writeFiles(
        files.map((f) => ({ path: f.path, content: Buffer.isBuffer(f.content) ? f.content : Buffer.from(f.content) })),
      );
    },
  };

  // Run bash from the sandbox's home dir (the bash tool prepends `cd <dest>`).
  const { tools } = await createBashTool({ sandbox: adapter, destination: '/vercel/sandbox' });

  const agent = new ToolLoopAgent({
    model: anthropic('claude-sonnet-4-5'),
    tools,
    instructions: system,
    stopWhen: stepCountIs(20),
  });

  console.log('› Running the agent (loop on host, bash in the sandbox)…\n');
  const result = await agent.generate({
    prompt: TASK,
    onStepFinish: ({ toolCalls }) => {
      for (const call of toolCalls) {
        if (call.toolName === 'bash') {
          const cmd = (call.input as { command?: string })?.command ?? '';
          process.stdout.write(`-> bash: ${cmd}\n`);
        }
      }
    },
  });

  console.log(
    '\n===== FINAL ANSWER =====\n' +
      (result.text || '(empty)') +
      `\n\n(steps: ${result.steps.length})`,
  );
} finally {
  await sandbox.stop();
}
