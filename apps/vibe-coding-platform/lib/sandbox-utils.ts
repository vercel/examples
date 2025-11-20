/**
 * Utility functions for sandbox operations
 */

import { runCommand } from './trigger-wrapper'

/**
 * Ensure pnpm is installed in the sandbox
 * Returns true if pnpm is available, false if installation failed
 */
export async function ensurePnpm(sandboxId: string): Promise<boolean> {
  // Check if pnpm is installed
  const checkPnpm = await runCommand(sandboxId, {
    command: 'which',
    args: ['pnpm'],
    wait: true,
  })

  if (checkPnpm.exitCode === 0) {
    return true // pnpm already installed
  }

  // Install pnpm globally
  console.log('Installing pnpm in sandbox...')
  const installPnpm = await runCommand(sandboxId, {
    command: 'npm',
    args: ['install', '-g', 'pnpm@latest'],
    wait: true,
  })

  if (installPnpm.exitCode === 0) {
    console.log('✅ pnpm installed successfully')
    return true
  } else {
    console.error('❌ Failed to install pnpm:', installPnpm.stderr)
    return false
  }
}

/**
 * Run pnpm command with automatic installation if needed
 */
export async function runPnpmCommand(
  sandboxId: string,
  args: string[],
  options?: {
    cwd?: string
    env?: Record<string, string>
    wait?: boolean
  }
) {
  // Ensure pnpm is installed
  const pnpmAvailable = await ensurePnpm(sandboxId)

  if (!pnpmAvailable) {
    return {
      commandId: '',
      status: 'failed' as const,
      error: 'Failed to install pnpm',
    }
  }

  // Run the pnpm command
  return await runCommand(sandboxId, {
    command: 'pnpm',
    args,
    wait: options?.wait !== false, // Default to true
    cwd: options?.cwd,
    env: options?.env,
  })
}

/**
 * Setup a Node.js/pnpm project in the sandbox
 */
export async function setupNodeProject(
  sandboxId: string,
  projectPath: string = '/home/user/project'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Create project directory
    await runCommand(sandboxId, {
      command: 'mkdir',
      args: ['-p', projectPath],
      wait: true,
    })

    // Ensure pnpm is available
    const pnpmAvailable = await ensurePnpm(sandboxId)
    if (!pnpmAvailable) {
      return {
        success: false,
        error: 'Failed to install pnpm',
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
