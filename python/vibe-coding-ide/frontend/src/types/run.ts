export type ActionStatus = 'pending' | 'running' | 'done' | 'failed'

interface BaseAction {
  id: string
  kind: string
  status: ActionStatus
  timestamp: string // ISO string supplied by backend
  metadata?: Record<string, unknown> // optional, additional info like turn number
}

export interface UserMessageAction extends BaseAction {
  kind: 'user_message'
  content: string
}

export interface AssistantThoughtAction extends BaseAction {
  kind: 'assistant_thought'
  content: string
}

export interface ToolStartedAction extends BaseAction {
  kind: 'tool_started'
  toolName: string
  arguments: unknown
  logs?: string
}

export interface ToolCompletedAction extends BaseAction {
  kind: 'tool_completed'
  toolName: string
  result: unknown
  logs?: string
}

export interface ToolFailedAction extends BaseAction {
  kind: 'tool_failed'
  toolName: string
  error: string
}

export interface ExecRequestAction extends BaseAction {
  kind: 'exec_request'
  responseOnReject?: string
  resumeToken?: string
}

export interface ExecResultAction extends BaseAction {
  kind: 'exec_result'
  output: string
}

export interface SystemNoticeAction extends BaseAction {
  kind: 'system_notice'
  message: string
}

export interface FinalAnswerAction extends BaseAction {
  kind: 'final_answer'
  content: string
}

export type Action =
  | UserMessageAction
  | AssistantThoughtAction
  | ToolStartedAction
  | ToolCompletedAction
  | ToolFailedAction
  | ExecRequestAction
  | ExecResultAction
  | SystemNoticeAction
  | FinalAnswerAction

export interface Run {
  id: string
  userPrompt: string
  // Project scoping for multi-project tabs
  projectId?: string
  // Chat thread scoping within a project
  threadId?: string
  // High-level lifecycle status of the run (separate from per-action statuses)
  status?: RunStatus
  actions: Action[]
}

// Coarse-grained lifecycle for a run, used for UI state and switching logic
export type RunStatus =
  | 'queued'
  | 'streaming' // actively receiving events from SSE
  | 'waiting_exec' // paused, waiting for user to decide on execution
  | 'done' // completed with agent_output
  | 'failed' // terminal error
  | 'cancelled' // user cancelled
