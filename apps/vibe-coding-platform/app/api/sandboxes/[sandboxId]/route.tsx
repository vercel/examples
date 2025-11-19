import { NextRequest, NextResponse } from 'next/server'
import { runCommand } from '@/lib/trigger-wrapper'

/**
 * Check the status of an e2b sandbox by running a simple echo command
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> }
) {
  const { sandboxId } = await params
  try {
    const result = await runCommand(sandboxId, {
      command: 'echo',
      args: ['Sandbox status check'],
      wait: true,
    })

    if (result.status === 'completed') {
      return NextResponse.json({ status: 'running' })
    } else {
      return NextResponse.json({ status: 'stopped' })
    }
  } catch (error) {
    // If we can't connect to the sandbox, it's likely stopped
    return NextResponse.json({ status: 'stopped' })
  }
}
