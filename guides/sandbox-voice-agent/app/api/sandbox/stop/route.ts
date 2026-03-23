/**
 * Sandbox Stop API Endpoint
 *
 * Removes a sandbox from our tracking.
 * Note: The Vercel Sandbox will automatically expire based on its configured timeout.
 * This endpoint:
 * 1. Validates the sandbox exists
 * 2. Removes it from the sandbox manager
 * 3. Clears the localStorage entry on the client side
 */
import { NextResponse } from 'next/server';
import { sandboxManager } from '@/lib/sandbox-manager';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sandboxId } = body;

    if (!sandboxId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing sandboxId',
        },
        { status: 400 }
      );
    }

    console.log(`[Sandbox] Removing sandbox ${sandboxId} from tracking...`);

    // Check if sandbox exists in our manager
    const sandbox = sandboxManager.get(sandboxId);
    if (!sandbox) {
      console.log(`[Sandbox] Sandbox ${sandboxId} not found in manager`);
      return NextResponse.json({
        success: true,
        message: 'Sandbox already removed',
      });
    }

    // Remove from our tracking
    // Note: The actual sandbox will expire based on its timeout configuration
    sandboxManager.remove(sandboxId);
    console.log(`[Sandbox ${sandboxId}] Removed from tracking`);

    return NextResponse.json({
      success: true,
      message: 'Sandbox removed from tracking',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sandbox] Stop request failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove sandbox',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
