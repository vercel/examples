/**
 * app/api/run/route.ts — Next.js (App Router) variant of sandbox.ts.
 *
 * POST /api/run  →  spins up a Vercel Sandbox, installs the `browse` CLI, runs
 * the BrowseCLI demo against a protected site through a Verified Browserbase
 * browser, and streams the combined stdout/stderr back as plain text.
 *
 * This is the Templates-Marketplace-friendly shape (Vercel favors Next.js).
 * The standalone `sandbox.ts` remains the primary, directly-runnable artifact.
 *
 * Env (Project / Vercel env vars): BROWSERBASE_API_KEY.
 * Vercel Sandbox auth (VERCEL_TOKEN / VERCEL_TEAM_ID / VERCEL_PROJECT_ID) is
 * resolved automatically when this route runs on Vercel.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Sandbox } from '@vercel/sandbox';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: Request): Promise<Response> {
  const { BROWSERBASE_API_KEY } = process.env;
  if (!BROWSERBASE_API_KEY) {
    return new Response(
      'Missing BROWSERBASE_API_KEY in environment.',
      { status: 500 },
    );
  }

  let targetUrl: string | undefined;
  try {
    const body = await req.json();
    targetUrl = typeof body?.targetUrl === 'string' ? body.targetUrl : undefined;
  } catch {
    // no body → use the default target inside the demo script
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      const emit = (line: string) => controller.enqueue(enc.encode(line));

      const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 300_000 });
      emit(`› Sandbox ready: ${sandbox.name}\n`);

      try {
        await sandbox.runCommand({ cmd: 'npm', args: ['install', '-g', 'browse@latest'] });

        const demo = readFileSync(join(process.cwd(), 'browsecli-demo.sh'), 'utf8');
        await sandbox.writeFiles([
          { path: 'browsecli-demo.sh', content: Buffer.from(demo) },
        ]);

        const cmd = await sandbox.runCommand({
          cmd: 'bash',
          args: ['-lc', 'chmod +x browsecli-demo.sh && ./browsecli-demo.sh'],
          env: {
            BROWSERBASE_API_KEY,
            ...(targetUrl ? { TARGET_URL: targetUrl } : {}),
          },
        });

        emit(await cmd.stdout());
        emit(await cmd.stderr());
        emit(`\n[exit ${cmd.exitCode}]\n`);
      } finally {
        await sandbox.stop();
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
