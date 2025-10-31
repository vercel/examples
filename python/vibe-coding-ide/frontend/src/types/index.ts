export interface AgentEvent {
  event_type: string
  task_id: string
  agent_name?: string
  turn?: number
  data?: any
  error?: string
  timestamp: string
}

export interface ToolCall {
  id: string
  tool_name: string
  arguments: any
  status: 'started' | 'completed' | 'failed'
  result?: any
  error?: string
}

export interface ThinkingProgress {
  task_id: string
  tool_calls: Record<string, ToolCall>
  is_complete: boolean
  final_output?: any
  error?: string
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  thinking?: ThinkingProgress
}
