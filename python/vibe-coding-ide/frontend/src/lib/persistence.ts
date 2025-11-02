import type { SandboxState } from '../types/sandbox'

export type PersistedProjectState = {
  files: Record<string, string>
  activeFile: string
  folders?: string[]
  expandedFolders?: string[]
  model?: string
  templateId?: string
  // Persist sandbox snapshot metadata only (omit large caches like lastData)
  sandbox?: Omit<SandboxState, 'lastData' | 'shouldSyncOnNextRun'>
}

export type PersistedState = {
  projects: { id: string; name: string }[]
  activeProjectId: string
  projectStates: Record<string, PersistedProjectState>
  version?: number
}

const STORAGE_KEY = 'nfca_state_v1'

export function loadPersistedState(): PersistedState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedState
    if (
      !parsed ||
      !Array.isArray(parsed.projects) ||
      typeof parsed.activeProjectId !== 'string' ||
      typeof parsed.projectStates !== 'object'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota/serialization errors
  }
}

// -----------------------------
// Chat history persistence (per project, keep last 5)
// -----------------------------

import type { Run, Action, UserMessageAction } from '../types/run'

export type PersistedChatThread = {
  id: string
  projectId: string
  title: string
  createdAt: string // ISO
  // Time of most recent human message in this thread (ISO). Used for ordering.
  lastHumanAt?: string
  // Runs and order for this chat thread
  runs: Record<string, Run>
  order: string[]
}

export type PersistedChatsState = {
  threadsByProject: Record<string, PersistedChatThread[]>
  version?: number
}

const CHAT_STORAGE_KEY = 'nfca_chats_v1'
export const MAX_THREADS_PER_PROJECT = 5

export function loadChatState(): PersistedChatsState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) return { threadsByProject: {}, version: 1 } as PersistedChatsState
    const parsed = JSON.parse(raw) as
      | PersistedChatsState
      | Record<string, unknown>
    const maybe = parsed as Record<string, unknown>
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof maybe.threadsByProject !== 'object'
    ) {
      return { threadsByProject: {}, version: 1 }
    }
    return parsed as PersistedChatsState
  } catch {
    return { threadsByProject: {}, version: 1 }
  }
}

export function saveChatState(state: PersistedChatsState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function getProjectChatThreads(
  projectId: string
): PersistedChatThread[] {
  const state = loadChatState() || { threadsByProject: {}, version: 1 }
  const list = state.threadsByProject[projectId] || []
  // Sort by last human at desc; tie-breaker by createdAt desc; stable on id
  const sorted = [...list].sort((a, b) => {
    const aH = a.lastHumanAt ? Date.parse(a.lastHumanAt) : 0
    const bH = b.lastHumanAt ? Date.parse(b.lastHumanAt) : 0
    if (aH !== bH) return bH - aH
    const aC = Date.parse(a.createdAt || '0')
    const bC = Date.parse(b.createdAt || '0')
    if (aC !== bC) return bC - aC
    return (b.id || '').localeCompare(a.id || '')
  })
  return sorted
}

function deriveTitleFromRuns(
  runs: Record<string, Run>,
  order: string[],
  createdAtISO: string
): string {
  for (const id of order) {
    const r = runs[id]
    if (!r) continue
    const firstUser = (r.actions || []).find(
      (a: Action): a is UserMessageAction => a.kind === 'user_message'
    )
    if (
      firstUser &&
      typeof firstUser.content === 'string' &&
      firstUser.content.trim()
    ) {
      const txt = firstUser.content.trim().replace(/\s+/g, ' ')
      return txt.length > 60 ? txt.slice(0, 60) + '…' : txt
    }
  }
  const d = new Date(createdAtISO)
  return `Chat ${d.toLocaleString()}`
}

function computeLastHumanAt(
  runs: Record<string, Run>,
  order: string[]
): string | undefined {
  let latest: number = 0
  const considerRun = (r: Run | undefined) => {
    if (!r) return
    for (const a of r.actions || []) {
      if (a.kind === 'user_message' && a.timestamp) {
        const t = Date.parse(a.timestamp)
        if (!Number.isNaN(t) && t > latest) latest = t
      }
    }
  }
  // Prefer provided order to iterate runs deterministically
  for (const id of order) considerRun(runs[id])
  // In case some runs are missing from order, also scan remaining runs
  for (const [id, r] of Object.entries(runs)) {
    if (!order.includes(id)) considerRun(r)
  }
  return latest > 0 ? new Date(latest).toISOString() : undefined
}

export function upsertCurrentChatThread(
  projectId: string,
  runs: Record<string, Run>,
  order: string[]
): void {
  const base =
    loadChatState() ||
    ({ threadsByProject: {}, version: 1 } as PersistedChatsState)
  const list = base.threadsByProject[projectId] || []
  const nowISO = new Date().toISOString()
  if (list.length === 0) {
    const newThread: PersistedChatThread = {
      id: `chat_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      projectId,
      title: deriveTitleFromRuns(runs, order, nowISO),
      createdAt: nowISO,
      lastHumanAt: computeLastHumanAt(runs, order),
      runs: { ...runs },
      order: [...order],
    }
    base.threadsByProject[projectId] = [newThread]
    saveChatState({ ...base })
    return
  }
  // Update the first thread (current) with latest runs/order and possibly title
  const current = { ...list[0] } as PersistedChatThread
  current.runs = { ...runs }
  current.order = [...order]
  current.title = deriveTitleFromRuns(runs, order, current.createdAt || nowISO)
  current.lastHumanAt = computeLastHumanAt(runs, order)
  const updated = [current, ...list.slice(1)]
  base.threadsByProject[projectId] = updated.slice(0, MAX_THREADS_PER_PROJECT)
  saveChatState({ ...base })
}

// Upsert a specific thread by id for a project, preserving list order.
export function upsertThreadById(
  projectId: string,
  threadId: string,
  runs: Record<string, Run>,
  order: string[]
): void {
  const base =
    loadChatState() ||
    ({ threadsByProject: {}, version: 1 } as PersistedChatsState)
  const list = base.threadsByProject[projectId] || []
  const nowISO = new Date().toISOString()
  const idx = list.findIndex((t) => t.id === threadId)
  if (idx === -1) {
    // Create if missing
    const created: PersistedChatThread = {
      id: threadId,
      projectId,
      title: deriveTitleFromRuns(runs, order, nowISO),
      createdAt: nowISO,
      lastHumanAt: computeLastHumanAt(runs, order),
      runs: { ...runs },
      order: [...order],
    }
    base.threadsByProject[projectId] = [created, ...list].slice(
      0,
      MAX_THREADS_PER_PROJECT
    )
    saveChatState({ ...base })
    return
  }
  const current = { ...list[idx] } as PersistedChatThread
  current.runs = { ...runs }
  current.order = [...order]
  current.title = deriveTitleFromRuns(runs, order, current.createdAt || nowISO)
  current.lastHumanAt = computeLastHumanAt(runs, order)
  const next = [...list]
  next[idx] = current
  base.threadsByProject[projectId] = next
  saveChatState({ ...base })
}

// Merge a saved thread back into current runs/order without removing other threads' runs
export function mergeThreadIntoRuns(
  projectId: string,
  thread: PersistedChatThread
): { runs: Record<string, Run>; order: string[] } {
  const filteredRuns: Record<string, Run> = {}
  const filteredOrder: string[] = []
  for (const id of thread.order) {
    const r = thread.runs[id]
    if (!r) continue
    const scoped: Run = { ...r, projectId, threadId: thread.id } as Run
    filteredRuns[id] = scoped
    filteredOrder.push(id)
  }
  return { runs: filteredRuns, order: filteredOrder }
}

export function startNewChatThread(projectId: string): PersistedChatThread {
  const base =
    loadChatState() ||
    ({ threadsByProject: {}, version: 1 } as PersistedChatsState)
  const nowISO = new Date().toISOString()
  const newThread: PersistedChatThread = {
    id: `chat_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    projectId,
    title: `New Chat ${new Date(nowISO).toLocaleTimeString()}`,
    createdAt: nowISO,
    lastHumanAt: undefined,
    runs: {},
    order: [],
  }
  const list = base.threadsByProject[projectId] || []
  const next = [newThread, ...list]
  base.threadsByProject[projectId] = next.slice(0, MAX_THREADS_PER_PROJECT)
  saveChatState({ ...base })
  return newThread
}

export function setCurrentChatThread(
  projectId: string,
  threadId: string
): PersistedChatThread | null {
  const base =
    loadChatState() ||
    ({ threadsByProject: {}, version: 1 } as PersistedChatsState)
  const list = base.threadsByProject[projectId] || []
  const idx = list.findIndex((t) => t.id === threadId)
  if (idx === -1) return null
  const chosen = list[idx]
  // No reordering here; selection should not mutate order. Persist chosen updates only.
  base.threadsByProject[projectId] = list
  saveChatState({ ...base })
  return chosen
}

// Remove a chat thread from a project and persist the change
export function deleteChatThread(projectId: string, threadId: string): void {
  const base =
    loadChatState() ||
    ({ threadsByProject: {}, version: 1 } as PersistedChatsState)
  const list = base.threadsByProject[projectId] || []
  base.threadsByProject[projectId] = list.filter((t) => t.id !== threadId)
  saveChatState({ ...base })
}
