/**
 * Direct task handlers for local development.
 * These are the same functions used by Trigger.dev tasks but can be called directly.
 */

import { Sandbox } from 'e2b'
import type {
  SandboxConfig,
  SandboxInfo,
  CommandConfig,
  CommandResult,
  FileUpload,
} from '@/lib/e2b-types'
import {
  initCommandLogs,
  appendLog,
  completeCommand,
  failCommand,
} from '@/lib/log-store'

// Store active sandboxes in memory
const activeSandboxes = new Map<string, Sandbox>()

export async function createSandboxHandler(
  payload: SandboxConfig
): Promise<SandboxInfo> {
  try {
    // Get E2B API key from environment
    const apiKey = process.env.E2B_API_KEY
    if (!apiKey) {
      throw new Error('E2B_API_KEY environment variable is not set')
    }

    const sandbox = await Sandbox.create({
      apiKey,
      timeoutMs: payload.timeout || 600000,
      metadata: payload.metadata as Record<string, string> | undefined,
    })

    activeSandboxes.set(sandbox.sandboxId, sandbox)

    return {
      sandboxId: sandbox.sandboxId,
      status: 'running',
      ports: payload.ports,
    }
  } catch (error) {
    return {
      sandboxId: '',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function runCommandHandler(payload: {
  sandboxId: string
  command: CommandConfig
}): Promise<CommandResult> {
  // Use provided commandId or generate one
  const commandId =
    payload.command.commandId ||
    `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  console.log(`[runCommandHandler] Starting command execution:`, {
    sandboxId: payload.sandboxId,
    command: payload.command.command,
    args: payload.command.args,
    commandId,
  })

  try {
    let sandbox = activeSandboxes.get(payload.sandboxId)

    if (!sandbox) {
      const apiKey = process.env.E2B_API_KEY
      if (!apiKey) {
        console.error('[runCommandHandler] E2B_API_KEY is not set')
        throw new Error('E2B_API_KEY environment variable is not set')
      }
      console.log(
        `[runCommandHandler] Connecting to sandbox: ${payload.sandboxId}`
      )
      sandbox = await Sandbox.connect(payload.sandboxId, { apiKey })
      activeSandboxes.set(payload.sandboxId, sandbox)
      console.log(`[runCommandHandler] Connected to sandbox successfully`)
    }

    // Auto-install pnpm if running a pnpm command
    if (payload.command.command === 'pnpm') {
      console.log(
        '[runCommandHandler] Detected pnpm command, checking if pnpm is installed...'
      )

      let pnpmInstalled = false
      try {
        const checkResult = await sandbox.commands.run('which pnpm')
        console.log(
          `[runCommandHandler] which pnpm result: exitCode=${checkResult.exitCode}, stdout=${checkResult.stdout}`
        )
        pnpmInstalled = checkResult.exitCode === 0
      } catch (e) {
        // which pnpm throws if pnpm is not found (exit code 1)
        console.log(
          '[runCommandHandler] which pnpm failed (pnpm not installed)'
        )
        pnpmInstalled = false
      }

      if (!pnpmInstalled) {
        console.log('[runCommandHandler] pnpm not found, installing...')
        try {
          const installResult = await sandbox.commands.run(
            'npm install -g pnpm@latest'
          )
          console.log(
            `[runCommandHandler] npm install -g pnpm result: exitCode=${installResult.exitCode}`
          )
          if (installResult.exitCode !== 0) {
            console.error(
              '[runCommandHandler] Failed to install pnpm:',
              installResult.stderr
            )
          } else {
            console.log('[runCommandHandler] pnpm installed successfully')
          }
        } catch (installError) {
          console.error(
            '[runCommandHandler] Error installing pnpm:',
            installError
          )
        }
      } else {
        console.log('[runCommandHandler] pnpm is already installed')
      }
    }

    const cmd = `${payload.command.command} ${(payload.command.args || []).join(
      ' '
    )}`

    console.log(`[runCommandHandler] Executing: ${cmd}`)

    // Initialize log storage for this command
    initCommandLogs(commandId)
    appendLog(commandId, 'info', `Running: ${cmd}`)

    // Detect if this is a dev server command that runs indefinitely
    const isDevServer =
      (payload.command.command === 'pnpm' ||
        payload.command.command === 'npm' ||
        payload.command.command === 'yarn') &&
      payload.command.args?.some(
        (arg) => arg === 'dev' || arg === 'start' || arg.includes('dev')
      )

    if (isDevServer) {
      console.log(
        `[runCommandHandler] Detected dev server command, running in background mode`
      )
    }

    // Run command with streaming callbacks
    // Use longer timeout for dev servers (5 min) or background mode
    const result = await sandbox.commands.run(cmd, {
      onStdout: (data) => {
        console.log(
          `[runCommandHandler] stdout: ${data.substring(0, 200)}${
            data.length > 200 ? '...' : ''
          }`
        )
        appendLog(commandId, 'stdout', data)
      },
      onStderr: (data) => {
        console.log(
          `[runCommandHandler] stderr: ${data.substring(0, 200)}${
            data.length > 200 ? '...' : ''
          }`
        )
        appendLog(commandId, 'stderr', data)
      },
      timeoutMs: isDevServer ? 300000 : 60000, // 5 min for dev servers, 1 min for others
      background: isDevServer && !payload.command.wait, // Run in background if dev server and not explicitly waiting
    })

    console.log(
      `[runCommandHandler] Command completed: exitCode=${result.exitCode}`
    )

    // Mark command as completed
    completeCommand(commandId, result.exitCode ?? 0)

    if (payload.command.wait) {
      return {
        commandId,
        status: 'completed' as const,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
      }
    } else {
      return {
        commandId,
        status: 'running' as const,
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[runCommandHandler] Command failed:`, {
      commandId,
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
    })
    failCommand(commandId, errorMsg)
    return {
      commandId,
      status: 'failed' as const,
      error: errorMsg,
    }
  }
}

export async function uploadFilesHandler(payload: {
  sandboxId: string
  files: FileUpload[]
}) {
  try {
    let sandbox = activeSandboxes.get(payload.sandboxId)

    if (!sandbox) {
      sandbox = await Sandbox.connect(payload.sandboxId)
      activeSandboxes.set(payload.sandboxId, sandbox)
    }

    const uploadedPaths: string[] = []

    for (const file of payload.files) {
      const content =
        typeof file.content === 'string'
          ? file.content
          : file.content.toString('utf-8')
      await sandbox.files.write(file.path, content)
      uploadedPaths.push(file.path)
    }

    return {
      success: true,
      uploaded: uploadedPaths,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function getPreviewURLHandler(payload: {
  sandboxId: string
  port: number
}) {
  try {
    let sandbox = activeSandboxes.get(payload.sandboxId)

    if (!sandbox) {
      sandbox = await Sandbox.connect(payload.sandboxId)
      activeSandboxes.set(payload.sandboxId, sandbox)
    }

    const url = sandbox.getHost(payload.port)

    return {
      success: true,
      url,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function readFileHandler(payload: {
  sandboxId: string
  path: string
}) {
  try {
    let sandbox = activeSandboxes.get(payload.sandboxId)

    if (!sandbox) {
      sandbox = await Sandbox.connect(payload.sandboxId)
      activeSandboxes.set(payload.sandboxId, sandbox)
    }

    const content = await sandbox.files.read(payload.path)

    return {
      success: true,
      content,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function stopSandboxHandler(payload: { sandboxId: string }) {
  try {
    const sandbox = activeSandboxes.get(payload.sandboxId)

    if (sandbox) {
      await sandbox.kill()
      activeSandboxes.delete(payload.sandboxId)
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
