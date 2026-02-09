import { NextRequest, NextResponse } from 'next/server'
import { Sandbox } from '@e2b/sdk'

/**
 * Check the status of an E2B Sandbox.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> },
) {
  const { sandboxId } = await params
  try {
    const sandbox = await Sandbox.reconnect(sandboxId)
    // Run a simple command to verify the sandbox is responsive
    await sandbox.process.startAndWait('echo "Sandbox status check"')
    return NextResponse.json({ status: 'running' })
  } catch (error: any) {
    // E2B throws errors when sandbox is not found or stopped
    if (
      error?.message?.includes('not found') ||
      error?.message?.includes('stopped') ||
      error?.message?.includes('does not exist')
    ) {
      return NextResponse.json({ status: 'stopped' })
    }
    throw error
  }
}
