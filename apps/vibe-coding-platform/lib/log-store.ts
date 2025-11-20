/**
 * In-memory log store for command output streaming.
 *
 * In production, replace with Redis or a database for persistence
 * across multiple instances.
 */

export interface LogEntry {
  timestamp: number
  stream: 'stdout' | 'stderr' | 'info' | 'error'
  data: string
}

export interface CommandLogState {
  logs: LogEntry[]
  status: 'running' | 'completed' | 'failed'
  exitCode?: number
  error?: string
}

// In-memory store for command logs
const commandLogs = new Map<string, CommandLogState>()

/**
 * Initialize log storage for a command
 */
export function initCommandLogs(commandId: string): void {
  commandLogs.set(commandId, {
    logs: [],
    status: 'running',
  })
}

/**
 * Append a log entry for a command
 */
export function appendLog(
  commandId: string,
  stream: LogEntry['stream'],
  data: string
): void {
  const state = commandLogs.get(commandId)
  if (state) {
    state.logs.push({
      timestamp: Date.now(),
      stream,
      data,
    })
  }
}

/**
 * Mark command as completed
 */
export function completeCommand(commandId: string, exitCode: number): void {
  const state = commandLogs.get(commandId)
  if (state) {
    state.status = 'completed'
    state.exitCode = exitCode
  }
}

/**
 * Mark command as failed
 */
export function failCommand(commandId: string, error: string): void {
  const state = commandLogs.get(commandId)
  if (state) {
    state.status = 'failed'
    state.error = error
  }
}

/**
 * Get logs for a command, optionally starting from a specific index
 */
export function getCommandLogs(
  commandId: string,
  fromIndex: number = 0
): {
  logs: LogEntry[]
  status: CommandLogState['status']
  exitCode?: number
  error?: string
} | null {
  const state = commandLogs.get(commandId)
  if (!state) return null

  return {
    logs: state.logs.slice(fromIndex),
    status: state.status,
    exitCode: state.exitCode,
    error: state.error,
  }
}

/**
 * Get total log count for a command
 */
export function getLogCount(commandId: string): number {
  const state = commandLogs.get(commandId)
  return state?.logs.length ?? 0
}

/**
 * Clean up logs for a command (call after frontend has received all logs)
 */
export function cleanupCommandLogs(commandId: string): void {
  commandLogs.delete(commandId)
}

/**
 * Get all command IDs (for debugging)
 */
export function getAllCommandIds(): string[] {
  return Array.from(commandLogs.keys())
}
