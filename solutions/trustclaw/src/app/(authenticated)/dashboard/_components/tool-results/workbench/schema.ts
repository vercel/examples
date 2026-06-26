import { z } from 'zod'
import { toolExecuteResponseSchema } from '../envelope'
import type { TerminalLogEntryData } from '../../terminal/types'

// ─── REMOTE_WORKBENCH / REMOTE_BASH_TOOL ────────────────────────────────────

const workbenchDataSchema = z
  .object({
    stdout: z.string().optional(),
    stderr: z.string().optional(),
    error: z.string().optional(),
  })
  .passthrough()

const workbenchArgsSchema = z
  .object({
    thought: z.string().optional(),
    command: z.string().optional(),
    code_to_execute: z.string().optional(),
    current_step: z.string().optional(),
    current_step_metric: z.string().optional(),
  })
  .passthrough()

export type WorkbenchToolResultData = {
  type: 'workbench' | 'bash'
  thought?: string
  code?: string
  currentStep?: string
  stepMetric?: string
  stdout?: string
  stderr?: string
  error?: string
  successful?: boolean
}

export function parseWorkbenchResult(
  result: unknown,
  args: Record<string, unknown>,
  isBash: boolean
): WorkbenchToolResultData | null {
  const envelope = toolExecuteResponseSchema.safeParse(result)
  if (!envelope.success) return null

  const data = workbenchDataSchema.safeParse(envelope.data.data ?? {})
  const parsedArgs = workbenchArgsSchema.safeParse(args)
  const safeArgs = parsedArgs.success ? parsedArgs.data : {}

  return {
    type: isBash ? 'bash' : 'workbench',
    thought: safeArgs.thought,
    code: isBash ? safeArgs.command : safeArgs.code_to_execute,
    currentStep: safeArgs.current_step,
    stepMetric: safeArgs.current_step_metric,
    stdout: data.success ? data.data.stdout : undefined,
    stderr:
      data.success && data.data.stderr && data.data.stderr.length > 0
        ? data.data.stderr
        : undefined,
    error:
      data.success && data.data.error && data.data.error.length > 0
        ? data.data.error
        : undefined,
    successful: envelope.data.successful,
  }
}

export function getWorkbenchData(
  log: TerminalLogEntryData
): WorkbenchToolResultData | null {
  if (
    !log.toolName.endsWith('REMOTE_WORKBENCH') &&
    !log.toolName.endsWith('REMOTE_BASH_TOOL')
  )
    return null
  const isBash = log.toolName.endsWith('REMOTE_BASH_TOOL')
  return parseWorkbenchResult(log.result, log.args, isBash)
}
