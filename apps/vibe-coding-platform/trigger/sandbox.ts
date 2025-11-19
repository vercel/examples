/**
 * Trigger.dev tasks for managing e2b sandboxes.
 *
 * This file defines tasks that handle:
 * - Creating sandboxes
 * - Running commands
 * - Uploading files
 * - Getting preview URLs
 *
 * Uses Trigger.dev v3 `task` API
 */

import { task } from '@trigger.dev/sdk/v3'
import { Sandbox } from 'e2b'
import type {
  SandboxConfig,
  SandboxInfo,
  CommandConfig,
  CommandResult,
  FileUpload,
} from '@/lib/e2b-types'

// Store active sandboxes in memory (in production, use a database or Redis)
// Note: This is a simple in-memory store. For production, use a persistent store.
const activeSandboxes = new Map<string, Sandbox>()

/**
 * Handler: Create a new e2b sandbox
 */
export async function createSandboxHandler(
  payload: SandboxConfig
): Promise<SandboxInfo> {
  try {
    // Create e2b sandbox
    const sandbox = await Sandbox.create({
      timeoutMs: payload.timeout || 600000,
      metadata: payload.metadata as Record<string, string> | undefined,
    })

    // Store sandbox instance for later use
    activeSandboxes.set(sandbox.sandboxId, sandbox)

    const result: SandboxInfo = {
      sandboxId: sandbox.sandboxId,
      status: 'running',
      ports: payload.ports,
    }

    return result
  } catch (error) {
    const result: SandboxInfo = {
      sandboxId: '',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    }

    return result
  }
}

/**
 * Task: Create a new e2b sandbox
 */
export const createSandboxTask = task({
  id: 'create-sandbox',
  run: createSandboxHandler,
})

/**
 * Task: Run a command in an existing sandbox
 */
export const runCommandTask = task({
  id: 'run-command',
  run: async (payload: { sandboxId: string; command: CommandConfig }) => {
    try {
      // Get sandbox instance
      let sandbox = activeSandboxes.get(payload.sandboxId)

      if (!sandbox) {
        // Try to reconnect to existing sandbox
        sandbox = await Sandbox.connect(payload.sandboxId)
        activeSandboxes.set(payload.sandboxId, sandbox)
      }

      // Run the command
      const cmd = `${payload.command.command} ${(
        payload.command.args || []
      ).join(' ')}`
      const result = await sandbox.commands.run(cmd)

      if (payload.command.wait) {
        // Wait for command to complete
        return {
          commandId: Date.now().toString(),
          status: 'completed' as const,
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr,
        } as CommandResult
      } else {
        // Return immediately for background processes
        return {
          commandId: Date.now().toString(),
          status: 'running' as const,
        } as CommandResult
      }
    } catch (error) {
      return {
        commandId: '',
        status: 'failed' as const,
        error: error instanceof Error ? error.message : String(error),
      } as CommandResult
    }
  },
})

/**
 * Task: Upload files to sandbox
 */
export const uploadFilesTask = task({
  id: 'upload-files',
  run: async (payload: { sandboxId: string; files: FileUpload[] }) => {
    try {
      // Get sandbox instance
      let sandbox = activeSandboxes.get(payload.sandboxId)

      if (!sandbox) {
        sandbox = await Sandbox.connect(payload.sandboxId)
        activeSandboxes.set(payload.sandboxId, sandbox)
      }

      // Upload files
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
  },
})

/**
 * Task: Get preview URL for a sandbox port
 */
export const getPreviewURLTask = task({
  id: 'get-preview-url',
  run: async (payload: { sandboxId: string; port: number }) => {
    try {
      // Get sandbox instance
      let sandbox = activeSandboxes.get(payload.sandboxId)

      if (!sandbox) {
        sandbox = await Sandbox.connect(payload.sandboxId)
        activeSandboxes.set(payload.sandboxId, sandbox)
      }

      // Get the URL
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
  },
})

/**
 * Task: Read a file from sandbox
 */
export const readFileTask = task({
  id: 'read-file',
  run: async (payload: { sandboxId: string; path: string }) => {
    try {
      // Get sandbox instance
      let sandbox = activeSandboxes.get(payload.sandboxId)

      if (!sandbox) {
        sandbox = await Sandbox.connect(payload.sandboxId)
        activeSandboxes.set(payload.sandboxId, sandbox)
      }

      // Read the file
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
  },
})

/**
 * Task: Stop/destroy a sandbox
 */
export const stopSandboxTask = task({
  id: 'stop-sandbox',
  run: async (payload: { sandboxId: string }) => {
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
  },
})
