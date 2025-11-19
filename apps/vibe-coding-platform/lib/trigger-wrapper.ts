/**
 * High-level wrapper functions for Trigger.dev + e2b sandbox operations.
 *
 * These functions provide a clean API for the AI tools to interact with sandboxes
 * via Trigger.dev v3 tasks.
 *
 * In development, tasks run locally. In production, they run via Trigger.dev.
 */

import { tasks } from '@trigger.dev/sdk/v3'
import type {
  SandboxConfig,
  SandboxInfo,
  CommandConfig,
  CommandResult,
  FileUpload,
} from './e2b-types'

// For local development, import task handlers directly
import {
  createSandboxHandler,
  runCommandHandler,
  uploadFilesHandler,
  getPreviewURLHandler,
  readFileHandler,
  stopSandboxHandler,
} from '@/trigger/handlers'

const isDev =
  process.env.NODE_ENV === 'development' || !process.env.TRIGGER_SECRET_KEY

/**
 * Create a new sandbox via Trigger.dev task
 */
export async function createSandbox(
  config: SandboxConfig
): Promise<SandboxInfo> {
  try {
    // In development, run task handler directly for faster feedback
    if (isDev) {
      return await createSandboxHandler(config)
    }

    const handle = await tasks.trigger('create-sandbox', config)
    return handle as unknown as SandboxInfo
  } catch (error) {
    console.error('Failed to create sandbox:', error)
    return {
      sandboxId: '',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Run a command in an existing sandbox
 */
export async function runCommand(
  sandboxId: string,
  command: CommandConfig
): Promise<CommandResult> {
  try {
    if (isDev) {
      return await runCommandHandler({ sandboxId, command })
    }

    const handle = await tasks.trigger('run-command', { sandboxId, command })
    return handle as unknown as CommandResult
  } catch (error) {
    console.error('Failed to run command:', error)
    return {
      commandId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Upload files to a sandbox
 */
export async function uploadFiles(
  sandboxId: string,
  files: FileUpload[]
): Promise<{ success: boolean; uploaded?: string[]; error?: string }> {
  try {
    if (isDev) {
      return await uploadFilesHandler({ sandboxId, files })
    }

    const handle = await tasks.trigger('upload-files', { sandboxId, files })
    return handle as unknown as {
      success: boolean
      uploaded?: string[]
      error?: string
    }
  } catch (error) {
    console.error('Failed to upload files:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Get preview URL for a sandbox port
 */
export async function getPreviewURL(
  sandboxId: string,
  port: number
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (isDev) {
      return await getPreviewURLHandler({ sandboxId, port })
    }

    const handle = await tasks.trigger('get-preview-url', { sandboxId, port })
    return handle as unknown as {
      success: boolean
      url?: string
      error?: string
    }
  } catch (error) {
    console.error('Failed to get preview URL:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Read a file from a sandbox
 */
export async function readFile(
  sandboxId: string,
  path: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    if (isDev) {
      return await readFileHandler({ sandboxId, path })
    }

    const handle = await tasks.trigger('read-file', { sandboxId, path })
    return handle as unknown as {
      success: boolean
      content?: string
      error?: string
    }
  } catch (error) {
    console.error('Failed to read file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Stop a sandbox
 */
export async function stopSandbox(
  sandboxId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isDev) {
      return await stopSandboxHandler({ sandboxId })
    }

    const handle = await tasks.trigger('stop-sandbox', { sandboxId })
    return handle as unknown as { success: boolean; error?: string }
  } catch (error) {
    console.error('Failed to stop sandbox:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
