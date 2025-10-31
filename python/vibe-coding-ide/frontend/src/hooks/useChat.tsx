import { useCallback } from 'react'
import type { Action } from '../types/run'
import { useRuns } from '../context/RunContext'
import { API_BASE } from '../constants'
import { useProjects } from '../context/ProjectsContext'
import { computeProjectHashes } from '../lib/hash'

declare const process: { env: Record<string, string | undefined> }

interface UseChatProps {
  userId: string
  input: string
  cancelling: boolean
  project: Record<string, string>
  proposals?: Record<string, string>
  projectId: string
  threadId: string
  setInput: (input: string) => void
  setLoading: (loading: boolean) => void
  setCancelling: (cancelling: boolean) => void
  stream: {
    connect: (runId: string, streamToken: string) => void
    resume: (runId: string, resumeToken: string, result: string) => void
    disconnect: (runId: string) => void
  }
  model: string
}

export const useChat = ({
  userId,
  input,
  cancelling,
  project,
  proposals,
  projectId,
  threadId,
  setInput,
  setLoading,
  setCancelling,
  stream,
  model,
}: UseChatProps) => {
  const { runs, runOrder, createRun, addAction, updateAction, setRunStatus } =
    useRuns()
  const { setLastEditorSync, shouldSyncOnNextRun, setSyncOnNextRun } =
    useProjects()
  const sendPrompt = useCallback(async () => {
    if (!input.trim()) return
    // In production, require NEXT_PUBLIC_API_URL to be set; otherwise show a user-facing error
    const isProd = (process.env.NODE_ENV || '').trim() === 'production'
    const hasApiUrl = Boolean((process.env.NEXT_PUBLIC_API_URL || '').trim())
    if (isProd && !hasApiUrl) {
      const errorRunId = `config_error_${Date.now()}`
      createRun(errorRunId, input, projectId, threadId)
      addAction(errorRunId, {
        id: `notice_${Date.now()}`,
        kind: 'system_notice',
        status: 'done',
        message:
          'Missing environment variable: NEXT_PUBLIC_API_URL is not set. Set it to your backend URL and reload.',
        timestamp: new Date().toISOString(),
      } as Action)
      return
    }
    setLoading(true)
    setInput('')

    // Build ordered message history with both user and assistant messages from prior runs
    const message_history = runOrder.flatMap((id) => {
      const run = runs[id]
      if (!run) return [] as { role: string; content: string }[]
      if (run.projectId !== projectId)
        return [] as { role: string; content: string }[]
      if (run.threadId !== threadId)
        return [] as { role: string; content: string }[]
      const messages: { role: string; content: string }[] = []
      for (const a of run.actions) {
        if (a.kind === 'user_message')
          messages.push({
            role: 'user',
            content: (a as Action & { content: string }).content,
          })
        if (a.kind === 'final_answer')
          messages.push({
            role: 'assistant',
            content: (a as Action & { content: string }).content,
          })
      }
      return messages
    })

    // If a sync was requested for next run, record an editor snapshot now (hashes of current editor files)
    if (shouldSyncOnNextRun) {
      try {
        const hashes = computeProjectHashes(project)
        setLastEditorSync({ at: new Date().toISOString(), fileHashes: hashes })
      } catch {
        // noop
      }
    }

    const res = await fetch(`${API_BASE}/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        query: input,
        project: (() => {
          const merged: Record<string, string> = { ...project }
          if (proposals) {
            for (const [p, c] of Object.entries(proposals)) merged[p] = c
          }
          return merged
        })(),
        message_history,
        model,
        project_id: projectId,
      }),
    })

    if (res.ok) {
      const { task_id, stream_token } = await res.json()
      createRun(task_id, input, projectId, threadId)

      // store user message action
      const userAction: Action = {
        id: `user_${Date.now()}`,
        kind: 'user_message',
        status: 'done',
        content: input,
        timestamp: new Date().toISOString(),
      } as const
      addAction(task_id, userAction)

      // Open SSE stream for this task; events are handled globally by useAgentStream → useAgentEvents
      stream.connect(task_id, stream_token)
      // Mark run as actively streaming (latest run will be treated as active in UI)
      setRunStatus(task_id, 'streaming')
      // Clear the one-shot sync flag after dispatching the run
      if (shouldSyncOnNextRun) setSyncOnNextRun(false)
    } else {
      console.error('enqueue failed')
      setLoading(false)
    }
  }, [
    input,
    userId,
    project,
    proposals,
    projectId,
    threadId,
    setInput,
    setLoading,
    createRun,
    addAction,
    runs,
    runOrder,
    stream,
    model,
    setRunStatus,
    setLastEditorSync,
    shouldSyncOnNextRun,
    setSyncOnNextRun,
  ])

  const cancelCurrentTask = useCallback(
    (taskId?: string) => {
      const targetId = taskId
      if (!targetId || cancelling) return
      setCancelling(true)
      // Stop the SSE stream first
      stream.disconnect(targetId)
      // Mark any running actions as done to hide loaders
      const run = runs[targetId]
      if (run) {
        for (const a of run.actions) {
          if (a.status === 'running') {
            updateAction(
              targetId,
              a.id,
              (prev) => ({ ...(prev as Action), status: 'done' } as Action)
            )
          }
        }
      }
      // Add a system notice
      addAction(targetId, {
        id: `cancel_${Date.now()}`,
        kind: 'system_notice',
        status: 'done',
        message: 'Task was cancelled.',
        timestamp: new Date().toISOString(),
      } as Action)
      // Update run status to cancelled
      setRunStatus(targetId, 'cancelled')
      // Clear UI state
      setCancelling(false)
      setLoading(false)
    },
    [
      cancelling,
      setCancelling,
      setLoading,
      stream,
      addAction,
      runs,
      updateAction,
      setRunStatus,
    ]
  )

  return {
    sendPrompt,
    cancelCurrentTask,
  }
}
