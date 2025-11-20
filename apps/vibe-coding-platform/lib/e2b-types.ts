/**
 * TypeScript types for e2b sandbox operations.
 *
 * These types mirror the interfaces we need for sandbox management.
 */

export interface SandboxConfig {
  timeout?: number // milliseconds
  ports?: number[]
  metadata?: Record<string, unknown>
}

export interface SandboxInfo {
  sandboxId: string
  status: 'creating' | 'running' | 'stopped' | 'error'
  ports?: number[]
  error?: string
}

export interface CommandConfig {
  command: string
  args?: string[]
  sudo?: boolean
  wait?: boolean
  cwd?: string
  env?: Record<string, string>
  commandId?: string // Pre-generated command ID for log streaming
}

export interface CommandResult {
  commandId: string
  status: 'pending' | 'executing' | 'running' | 'completed' | 'failed'
  exitCode?: number
  stdout?: string
  stderr?: string
  error?: string
}

export interface FileUpload {
  path: string
  content: string | Buffer
}

export interface LogLine {
  stream: 'stdout' | 'stderr'
  data: string
  timestamp: number
}
