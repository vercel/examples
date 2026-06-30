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

const req = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
};

const BROWSERBASE_API_KEY = req('BROWSERBASE_API_KEY');
const TASK =
  process.env.TASK ||
  "Using Amazon (https://www.amazon.com), research the current top mechanical keyboards: search the site, then for the top 5 results compare each product's title, price, star rating, and number of ratings. Return a comparison table including each product's URL.";

const system = `You are an autonomous deep-research agent. You have a \`browse\` CLI (Browserbase browser automation) in your bash tool — it is installed, and its auth and a shared browser session are already configured via environment variables. Learn how to use it by running \`browse --help\` (and \`browse <command> --help\` as needed), then complete the task. When you cite a document, link the direct document itself, not a viewer, preview, or index page that wraps it. Return a clear, well-sourced answer.`;

console.log('› Creating Vercel Sandbox (Firecracker microVM, node24)…');
// Default sandbox env vars. Vercel stores them encrypted server-side and injects
// them into every command, so they reach the `browse` commands the bash tool runs
// — without ever being written to a committed file or echoed.
//   BROWSERBASE_API_KEY — authenticates `browse` against Browserbase.
//   BROWSE_SESSION=agent — steers `browse` to run remotely and share one named
//   browser session across commands, so the agent never has to pass
//   --remote/--session flags itself.
const sandbox = await Sandbox.create({
  runtime: 'node24',
  timeout: 600_000,
  token: req('VERCEL_TOKEN'),
  teamId: req('VERCEL_TEAM_ID'),
  projectId: req('VERCEL_PROJECT_ID'),
  env: { BROWSERBASE_API_KEY, BROWSE_SESSION: 'agent' },
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

  // The model is served through Vercel AI Gateway: a bare `provider/model`
  // string resolves through the default Gateway provider in ai@6. Gateway reads
  // its credentials from the environment automatically — `VERCEL_OIDC_TOKEN`
  // (provided by `vercel env pull` / a linked Vercel project) or
  // `AI_GATEWAY_API_KEY`. No separate Anthropic key is needed.
  const agent = new ToolLoopAgent({
    model: 'anthropic/claude-sonnet-5',
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
