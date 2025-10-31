import React from 'react'
import type { Run, Action } from '../types/run'

interface RunContextValue {
  runs: Record<string, Run>
  runOrder: string[]
  createRun: (
    runId: string,
    userPrompt: string,
    projectId?: string,
    threadId?: string
  ) => void
  addAction: (runId: string, action: Action) => void
  updateAction: (
    runId: string,
    actionId: string,
    updater: (prev: Action | undefined) => Action
  ) => void
  appendActionLog: (runId: string, actionId: string, line: string) => void
  clearProjectRuns: (projectId: string) => void
  replaceProjectRuns: (
    projectId: string,
    runs: Record<string, Run>,
    order: string[]
  ) => void
  mergeProjectRuns: (
    projectId: string,
    runs: Record<string, Run>,
    order: string[],
    threadId?: string
  ) => void
  setRunStatus: (runId: string, status: Run['status']) => void
}

const RunContext = React.createContext<RunContextValue | undefined>(undefined)

interface RunState {
  runs: Record<string, Run>
  order: string[]
}

function runReducer(
  state: RunState,
  action: { type: string; payload: unknown }
): RunState {
  switch (action.type) {
    case 'create': {
      const { id, prompt, projectId, threadId } = action.payload as {
        id: string
        prompt: string
        projectId?: string
        threadId?: string
      }
      if (state.runs[id]) return state
      return {
        runs: {
          ...state.runs,
          [id]: { id, userPrompt: prompt, projectId, threadId, actions: [] },
        },
        order: [...state.order, id],
      }
    }
    case 'addAction': {
      const { runId, newAction } = action.payload as {
        runId: string
        newAction: Action
      }
      const existing = state.runs[runId]
      if (!existing) return state
      return {
        runs: {
          ...state.runs,
          [runId]: { ...existing, actions: [...existing.actions, newAction] },
        },
        order: state.order,
      }
    }
    case 'updateAction': {
      const { runId, actionId, updater } = action.payload as {
        runId: string
        actionId: string
        updater: (prev: Action | undefined) => Action
      }
      const existingRun = state.runs[runId]
      if (!existingRun) return state
      const idx = existingRun.actions.findIndex((a) => a.id === actionId)
      let updatedActions: Action[]
      if (idx === -1) {
        updatedActions = [...existingRun.actions, updater(undefined)]
      } else {
        const updated = updater(existingRun.actions[idx])
        updatedActions = [...existingRun.actions]
        updatedActions[idx] = updated
      }
      return {
        runs: {
          ...state.runs,
          [runId]: { ...existingRun, actions: updatedActions },
        },
        order: state.order,
      }
    }
    case 'setRunStatus': {
      const { runId, status } = action.payload as {
        runId: string
        status: Run['status']
      }
      const existingRun = state.runs[runId]
      if (!existingRun) return state
      return {
        runs: { ...state.runs, [runId]: { ...existingRun, status } },
        order: state.order,
      }
    }
    case 'appendActionLog': {
      const { runId, actionId, line } = action.payload as {
        runId: string
        actionId: string
        line: string
      }
      const existingRun = state.runs[runId]
      if (!existingRun) return state
      const idx = existingRun.actions.findIndex((a) => a.id === actionId)
      if (idx === -1) return state
      const prev = existingRun.actions[idx] as Action
      const withLogs = prev as Action & { logs?: string }
      const nextLogs: string = withLogs.logs
        ? `${withLogs.logs}${line}`
        : `${line}`
      const updated = { ...prev, logs: nextLogs } as Action
      const updatedActions = [...existingRun.actions]
      updatedActions[idx] = updated
      return {
        runs: {
          ...state.runs,
          [runId]: { ...existingRun, actions: updatedActions },
        },
        order: state.order,
      }
    }
    case 'clearProject': {
      const { projectId } = action.payload as { projectId: string }
      const newRuns: Record<string, Run> = {}
      const newOrder: string[] = []
      for (const id of state.order) {
        const r = state.runs[id]
        if (!r) continue
        if (r.projectId !== projectId) {
          newRuns[id] = r
          newOrder.push(id)
        }
      }
      return { runs: newRuns, order: newOrder }
    }
    case 'replaceProject': {
      const { projectId, runs, order } = action.payload as {
        projectId: string
        runs: Record<string, Run>
        order: string[]
      }
      // Keep all runs from other projects; replace only target project
      const keepRuns: Record<string, Run> = {}
      const keepOrder: string[] = []
      for (const id of state.order) {
        const r = state.runs[id]
        if (!r) continue
        if (r.projectId !== projectId) {
          keepRuns[id] = r
          keepOrder.push(id)
        }
      }
      const mergedRuns: Record<string, Run> = { ...keepRuns, ...runs }
      const mergedOrder: string[] = [...keepOrder, ...order]
      return { runs: mergedRuns, order: mergedOrder }
    }
    case 'mergeProject': {
      const { projectId, runs, order, threadId } = action.payload as {
        projectId: string
        runs: Record<string, Run>
        order: string[]
        threadId?: string
      }
      // Keep everything and upsert provided runs for the same project, without removing others
      const nextRuns: Record<string, Run> = { ...state.runs }
      const nextOrder: string[] = [...state.order]
      const idsToProcess: string[] =
        order && order.length > 0 ? order : Object.keys(runs)
      for (const id of idsToProcess) {
        const run = runs[id]
        if (!run) continue
        const incoming =
          threadId && !run.threadId ? ({ ...run, threadId } as Run) : run
        if (incoming.projectId !== projectId) continue
        if (!nextRuns[id]) {
          nextRuns[id] = incoming
          if (!nextOrder.includes(id)) nextOrder.push(id)
        } else {
          // Merge actions while preserving existing ones
          const existing = nextRuns[id]
          nextRuns[id] = {
            ...existing,
            ...incoming,
            actions:
              existing.actions &&
              existing.actions.length >= (incoming.actions?.length || 0)
                ? existing.actions
                : incoming.actions || existing.actions,
            threadId: incoming.threadId ?? existing.threadId,
          } as Run
          if (!nextOrder.includes(id)) nextOrder.push(id)
        }
      }
      return { runs: nextRuns, order: nextOrder }
    }
    default:
      return state
  }
}

export const RunProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(runReducer, {
    runs: {},
    order: [],
  } as RunState)

  const createRun = React.useCallback(
    (
      runId: string,
      userPrompt: string,
      projectId?: string,
      threadId?: string
    ) => {
      dispatch({
        type: 'create',
        payload: { id: runId, prompt: userPrompt, projectId, threadId },
      })
    },
    []
  )

  const addAction = React.useCallback((runId: string, action: Action) => {
    dispatch({ type: 'addAction', payload: { runId, newAction: action } })
  }, [])

  const updateAction = React.useCallback(
    (
      runId: string,
      actionId: string,
      updater: (prev: Action | undefined) => Action
    ) => {
      dispatch({ type: 'updateAction', payload: { runId, actionId, updater } })
    },
    []
  )

  const appendActionLog = React.useCallback(
    (runId: string, actionId: string, line: string) => {
      dispatch({ type: 'appendActionLog', payload: { runId, actionId, line } })
    },
    []
  )

  const setRunStatus = React.useCallback(
    (runId: string, status: Run['status']) => {
      dispatch({ type: 'setRunStatus', payload: { runId, status } })
    },
    []
  )

  const clearProjectRuns = React.useCallback((projectId: string) => {
    dispatch({ type: 'clearProject', payload: { projectId } })
  }, [])

  const replaceProjectRuns = React.useCallback(
    (projectId: string, runs: Record<string, Run>, order: string[]) => {
      dispatch({ type: 'replaceProject', payload: { projectId, runs, order } })
    },
    []
  )

  const mergeProjectRuns = React.useCallback(
    (
      projectId: string,
      runs: Record<string, Run>,
      order: string[],
      threadId?: string
    ) => {
      dispatch({
        type: 'mergeProject',
        payload: { projectId, runs, order, threadId },
      })
    },
    []
  )

  const value = React.useMemo<RunContextValue>(
    () => ({
      runs: state.runs,
      runOrder: state.order,
      createRun,
      addAction,
      updateAction,
      appendActionLog,
      clearProjectRuns,
      replaceProjectRuns,
      mergeProjectRuns,
      setRunStatus,
    }),
    [
      state,
      createRun,
      addAction,
      updateAction,
      appendActionLog,
      clearProjectRuns,
      replaceProjectRuns,
      mergeProjectRuns,
      setRunStatus,
    ]
  )

  return <RunContext.Provider value={value}>{children}</RunContext.Provider>
}

export const useRuns = (): RunContextValue => {
  const ctx = React.useContext(RunContext)
  if (!ctx) throw new Error('useRuns must be used within RunProvider')
  return ctx
}
