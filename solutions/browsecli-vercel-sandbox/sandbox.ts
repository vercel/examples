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
  "Using SEC EDGAR (start at https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany), research the recent SEC filing activity of Snowflake, Datadog, and MongoDB. For each company find its most recent 10-Q — the filing date, the fiscal period it covers, and the URL of the primary filing document — plus the date of its most recent 10-K. Return a comparison table across all three companies, citing the EDGAR pages you used.";

const system = `You are an autonomous deep-research agent. You answer questions by investigating the live web with a real browser that runs remotely on Browserbase. You drive it by running the \`browse\` CLI through the bash tool — it is already installed and authenticated (BROWSERBASE_API_KEY is set in the shell).

Use one named session so every command shares one browser:
  browse open <url> --remote --session agent   # navigate to a URL
  browse get markdown body --session agent     # read the current page as markdown (keeps links)
  browse get text body --session agent         # read the current page as plain text
Run \`browse --help\` to discover more commands.
Since you're typing real shell commands, wrap any URL containing shell metacharacters (e.g. & or ?) in single quotes so the shell doesn't split it, e.g. browse open 'https://example.com/path?a=1&b=2' --remote --session agent.

Plan your own research: break the question into sub-questions, find and open relevant sources, follow links, and read pages to gather evidence. Use several independent sources and cross-check key facts. If a page errors or comes back empty, try a different source instead of retrying it unchanged. When you can answer thoroughly, run \`browse stop --session agent\` and return a concise, well-sourced synthesis that cites the URLs you used.

To stay effective:
- Pages are fully rendered (JavaScript runs) before you read them — the text/markdown you get back IS the real content. Read it carefully and extract what you need; don't assume a page "needs JavaScript" or abandon a source that already has the answer.
- Read each page once. Don't fetch the same page twice or as both markdown and text (for long pages \`browse get text body\` is best), and don't chase detours when a page you already have answers the question.
- Your steps are limited: once you have what you need for one item, move on, and leave yourself a step to write the final answer.`;

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
    stopWhen: stepCountIs(40),
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
