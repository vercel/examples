import { NextResponse } from 'next/server';
import { sandboxManager } from '@/lib/sandbox-manager';
import type { SandboxStatusResponse } from '@/types/sandbox';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sandboxId = searchParams.get('sandboxId');

  if (!sandboxId) {
    return NextResponse.json(
      { error: 'sandboxId parameter is required' },
      { status: 400 }
    );
  }

  const sandbox = sandboxManager.get(sandboxId);

  if (!sandbox) {
    return NextResponse.json({ error: 'Sandbox not found' }, { status: 404 });
  }

  const isExpired = sandboxManager.isExpired(sandboxId);
  if (isExpired) sandboxManager.updateStatus(sandboxId, 'stopped');

  const agentConnected = sandbox.status === 'ready' || sandbox.status === 'running';

  return NextResponse.json({
    sandbox,
    agentConnected,
    ready: agentConnected && !isExpired,
  } as SandboxStatusResponse);
}
