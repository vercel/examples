/**
 * sandbox.ts — run the BrowseCLI inside a Vercel Sandbox to reach any site
 * through a Verified Browserbase browser (residential IP, no datacenter
 * blocking, auto CAPTCHA-solve).
 *
 * A Vercel Sandbox is an ephemeral Firecracker microVM (NOT a serverless
 * function). It is great at running an agent loop, but a vanilla microVM has a
 * datacenter IP and no anti-bot hardening, so it gets blocked on the real web.
 *
 * The fix: keep the browser OUT of the sandbox. The sandbox runs the `browse`
 * CLI, which connects out over CDP to a Verified Browserbase browser that uses
 * a residential/verified IP, passes bot-detection fingerprinting, and
 * auto-solves CAPTCHAs server-side.
 *
 *   Vercel Sandbox (node + `browse`)  ──CDP/wss──▶  Browserbase Verified browser
 *
 * Run locally:
 *   pnpm i
 *   cp .env.example .env   # fill in Browserbase + Vercel creds
 *   npx tsx sandbox.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Sandbox } from '@vercel/sandbox';

const {
  BROWSERBASE_API_KEY,
  // Vercel Sandbox auth — see https://vercel.com/docs/vercel-sandbox
  VERCEL_TOKEN,
  VERCEL_TEAM_ID,
  VERCEL_PROJECT_ID,
  TARGET_URL,
} = process.env;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`Missing required env var: ${name} (see .env.example)`);
    process.exit(1);
  }
  return value;
}

async function main() {
  requireEnv('BROWSERBASE_API_KEY', BROWSERBASE_API_KEY);
  requireEnv('VERCEL_TOKEN', VERCEL_TOKEN);
  requireEnv('VERCEL_TEAM_ID', VERCEL_TEAM_ID);
  requireEnv('VERCEL_PROJECT_ID', VERCEL_PROJECT_ID);

  console.log('› Creating Vercel Sandbox (Firecracker microVM, runtime=node24)…');
  const sandbox = await Sandbox.create({
    runtime: 'node24',
    // 5 min is plenty for: install browse + open a Verified session + assert.
    timeout: 300_000,
    // Vercel resolves these from process.env automatically, but we pass them
    // explicitly so a single `tsx sandbox.ts` works without extra wiring.
    token: VERCEL_TOKEN,
    teamId: VERCEL_TEAM_ID,
    projectId: VERCEL_PROJECT_ID,
  });
  console.log(`› Sandbox ready: ${sandbox.name}`);

  try {
    // 1) Install the unified Browserbase CLI inside the microVM. No Chrome is
    //    installed here — the browser lives on Browserbase.
    console.log('› Installing `browse` CLI inside the sandbox…');
    const install = await sandbox.runCommand({
      cmd: 'npm',
      args: ['install', '-g', 'browse@latest'],
      stderr: process.stderr,
      stdout: process.stdout,
    });
    if (install.exitCode !== 0) {
      throw new Error(`npm install failed with exit code ${install.exitCode}`);
    }

    // 2) Upload the demo script into the sandbox filesystem.
    const demo = readFileSync(join(__dirname, 'browsecli-demo.sh'), 'utf8');
    await sandbox.writeFiles([
      { path: 'browsecli-demo.sh', content: Buffer.from(demo) },
    ]);

    // 3) Run the demo: create a Verified Browserbase session, open a
    //    Cloudflare-protected page over CDP, and assert real content.
    console.log('› Running BrowseCLI demo against a protected site…');
    const run = await sandbox.runCommand({
      cmd: 'bash',
      args: ['-lc', 'chmod +x browsecli-demo.sh && ./browsecli-demo.sh'],
      env: {
        BROWSERBASE_API_KEY: BROWSERBASE_API_KEY!,
        ...(TARGET_URL ? { TARGET_URL } : {}),
      },
      stderr: process.stderr,
      stdout: process.stdout,
    });

    if (run.exitCode !== 0) {
      console.error(`\n✗ Demo exited with code ${run.exitCode}`);
      process.exit(run.exitCode ?? 1);
    }
    console.log('\n✓ Done — BrowseCLI reached real content from inside the Vercel Sandbox.');
  } finally {
    await sandbox.stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
