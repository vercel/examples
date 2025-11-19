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
  try {
    let sandbox = activeSandboxes.get(payload.sandboxId)

    if (!sandbox) {
      sandbox = await Sandbox.connect(payload.sandboxId)
      activeSandboxes.set(payload.sandboxId, sandbox)
    }

    const cmd = `${payload.command.command} ${(payload.command.args || []).join(
      ' '
    )}`
    const result = await sandbox.commands.run(cmd)

    if (payload.command.wait) {
      return {
        commandId: Date.now().toString(),
        status: 'completed' as const,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
      }
    } else {
      return {
        commandId: Date.now().toString(),
        status: 'running' as const,
      }
    }
  } catch (error) {
    return {
      commandId: '',
      status: 'failed' as const,
      error: error instanceof Error ? error.message : String(error),
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
