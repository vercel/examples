/**
 * Sandbox Status API Endpoint
 *
 * Checks the status of a sandbox and whether the agent is ready.
 * Query parameter: sandboxId
 */
import { NextResponse } from 'next/server';
import { sandboxManager } from '@/lib/sandbox-manager';
import type { SandboxStatusResponse } from '@/types/sandbox';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sandboxId = searchParams.get('sandboxId');

    if (!sandboxId) {
      return NextResponse.json(
        {
          error: 'sandboxId parameter is required',
        },
        { status: 400 }
      );
    }

    // Get sandbox information
    const sandbox = sandboxManager.get(sandboxId);

    if (!sandbox) {
      return NextResponse.json(
        {
          error: 'Sandbox not found',
        },
        { status: 404 }
      );
    }

    // Check if sandbox is expired
    const isExpired = sandboxManager.isExpired(sandboxId);
    if (isExpired) {
      sandboxManager.updateStatus(sandboxId, 'stopped');
    }

    // Determine if agent is connected and ready
    const agentConnected = sandbox.status === 'ready' || sandbox.status === 'running';
    const ready = agentConnected && !isExpired;

    const response: SandboxStatusResponse = {
      sandbox,
      agentConnected,
      ready,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sandbox Status] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to check sandbox status',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
