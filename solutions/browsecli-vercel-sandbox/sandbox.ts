// Driver (runs locally): provisions a Vercel Sandbox, installs `browse` + the AI
// SDK inside it, and runs the agent loop IN the sandbox. The agent drives a
// Browserbase browser over CDP — so the browser never runs in the microVM.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Sandbox } from '@vercel/sandbox';

const __dirname = dirname(fileURLToPath(import.meta.url));
const req = (n: string): string => {
  const v = process.env[n];
  if (!v) { console.error(`Missing required env var: ${n}`); process.exit(1); }
  return v;
};

const ANTHROPIC_API_KEY = req('ANTHROPIC_API_KEY');
const BROWSERBASE_API_KEY = req('BROWSERBASE_API_KEY');
const { TASK } = process.env;

console.log('› Creating Vercel Sandbox (Firecracker microVM, node24)…');
const sandbox = await Sandbox.create({
  runtime: 'node24',
  timeout: 600_000,
  token: req('VERCEL_TOKEN'),
  teamId: req('VERCEL_TEAM_ID'),
  projectId: req('VERCEL_PROJECT_ID'),
});
console.log(`› Sandbox ready: ${sandbox.name}`);

try {
  // 1) Upload the agent into the sandbox.
  await sandbox.writeFiles([
    { path: 'agent.mjs', content: Buffer.from(readFileSync(join(__dirname, 'agent.mjs'))) },
    { path: 'package.json', content: Buffer.from('{"name":"browse-agent","type":"module","private":true}') },
  ]);

  // 2) Install the browse CLI (globally) + the AI SDK (locally) inside the sandbox.
  console.log('› Installing `browse` + AI SDK inside the sandbox…');
  const install = await sandbox.runCommand({
    cmd: 'bash',
    args: ['-lc', 'npm i -g browse@latest && npm i ai @ai-sdk/anthropic zod'],
    stderr: process.stderr,
  });
  if (install.exitCode !== 0) throw new Error(`install failed (exit ${install.exitCode})`);

  // 3) Run the agent loop IN the sandbox; stream its output. Keys are injected as env.
  console.log('› Running the browser agent inside the sandbox…\n');
  const run = await sandbox.runCommand({
    cmd: 'node',
    args: ['agent.mjs'],
    env: { ANTHROPIC_API_KEY, BROWSERBASE_API_KEY, ...(TASK ? { TASK } : {}) },
    stdout: process.stdout,
    stderr: process.stderr,
  });
  process.exitCode = run.exitCode ?? 0;
} finally {
  await sandbox.stop();
}
