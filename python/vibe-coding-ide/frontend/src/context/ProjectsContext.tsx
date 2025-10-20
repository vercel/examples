import React from 'react'
import {
  loadPersistedState,
  savePersistedState,
  type PersistedState,
  type PersistedProjectState,
} from '../lib/persistence'
import type { SandboxState, Snapshot } from '../types/sandbox'
import { computeProjectHashes, type FileHashes } from '../lib/hash'
import { getTemplateById, getStackById, TEMPLATES } from '../templates'
import { API_BASE } from '../constants'
import { getUserId } from '../lib/user'

export type ProjectTab = { id: string; name: string }

type ProjectState = {
  files: Record<string, string>
  proposals: Record<string, string>
  activeFile: string
  folders?: string[]
  expandedFolders: string[]
  input: string
  loading: boolean
  cancelling: boolean
  model: string
  activeThreadId: string | null
  templateId: string
  sandbox: SandboxState
  autoSyncing?: boolean
}

type ProjectsContextValue = {
  // project tabs
  projects: ProjectTab[]
  activeProjectId: string
  setActiveProjectId: (id: string) => void
  createProject: (name: string, templateId: string) => string // returns new id
  renameProject: (id: string, name: string) => void
  cloneProject: (id: string, newName?: string) => string | null
  deleteProject: (id: string) => void

  // active project state & views
  project: Record<string, string>
  proposals: Record<string, string>
  activeFile: string
  folders?: string[]
  expandedFolders: string[]
  setExpandedFolders: (paths: string[]) => void
  templateId: string

  // sandbox derived status and actions
  sandboxStatus: { editorAhead: number; sandboxAhead: number; diverged: number }
  editorAheadPaths: string[]
  sandboxAheadPaths: string[]
  divergedPaths: string[]
  hasSandboxBaseline: boolean
  setLastEditorSync: (snapshot: Snapshot) => void
  setLastSandboxSeen: (
    snapshot: Snapshot,
    lastData?: Record<string, string>
  ) => void
  markSyncOnNextRun: () => void // legacy alias, sets true
  shouldSyncOnNextRun: boolean
  setSyncOnNextRun: (v: boolean) => void

  // derived views
  isPathIgnored: (p: string) => boolean
  projectForTree: Record<string, string>
  proposalsForTree: Record<string, string>
  projectForSend: Record<string, string>
  proposalsForSend: Record<string, string>

  // file operations
  setActiveFile: (path: string) => void
  setCode: (content: string) => void // set content for active file
  upsertProposal: (filePath: string, newContent: string) => void
  clearProposal: (filePath: string) => void
  upsertFileIfMissing: (filePath: string, content: string) => void

  createFile: (path: string) => void
  renameFile: (oldPath: string, newPath: string) => void
  deleteFile: (path: string) => void
  moveFile: (srcPath: string, destDir: string) => void

  createFolder: (folderPath: string) => void
  renameFolder: (oldPath: string, newPath: string) => void
  deleteFolder: (folderPath: string) => void
  moveFolder: (srcFolder: string, destDir: string) => void

  // misc per-project fields useful elsewhere
  input: string
  setInput: (v: string) => void
  loading: boolean
  setLoading: (v: boolean) => void
  setLoadingForProject: (projectId: string, v: boolean) => void
  cancelling: boolean
  setCancelling: (v: boolean) => void
  model: string
  setModel: (v: string) => void
  activeThreadId: string | null
  setActiveThreadId: (v: string | null) => void

  // sandbox extras
  sandboxLastData?: Record<string, string>
  // auto sync state
  autoSyncing: boolean
  setAutoSyncing: (v: boolean) => void
  // manual immediate sync
  syncSandboxNow: () => Promise<boolean>
}

const ProjectsContext = React.createContext<ProjectsContextValue | null>(null)

const DEFAULT_DIFF_IGNORE_PATTERNS: string[] = [
  '__pycache__/',
  '*.pyc',
  '*.pyo',
  '*.pyd',
  '.DS_Store',
  'node_modules/',
  'vendor/',
  'Gemfile.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  '*.log',
]

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const persisted = React.useMemo<PersistedState | null>(
    () => loadPersistedState(),
    []
  )

  const defaultTemplateId = 'fastapi'
  const defaultTemplate = getTemplateById(defaultTemplateId) || TEMPLATES[0]

  const initialProjectId = React.useMemo(
    () =>
      persisted?.activeProjectId ||
      `proj_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 7)}`,
    [persisted]
  )

  const [projects, setProjects] = React.useState<ProjectTab[]>(() =>
    persisted?.projects?.length
      ? persisted.projects
      : [{ id: initialProjectId, name: 'Project 1' }]
  )

  const [activeProjectId, setActiveProjectIdState] = React.useState<string>(
    () => {
      const candidate = persisted?.activeProjectId || initialProjectId
      const exists = (
        persisted?.projects || [{ id: initialProjectId, name: 'Project 1' }]
      ).some((p: { id: string }) => p.id === candidate)
      return exists
        ? candidate
        : persisted?.projects?.[0]?.id || initialProjectId
    }
  )

  const [projectStates, setProjectStates] = React.useState<
    Record<string, ProjectState>
  >(() => {
    if (
      persisted?.projectStates &&
      Object.keys(persisted.projectStates).length
    ) {
      const out: Record<string, ProjectState> = {}
      for (const [id, s] of Object.entries(persisted.projectStates) as [
        string,
        PersistedProjectState
      ][]) {
        const files = s && s.files ? s.files : defaultTemplate.files
        let activeFile = s?.activeFile
        if (!activeFile || !(activeFile in files)) {
          const first = Object.keys(files)[0]
          activeFile = first || defaultTemplate.defaultActiveFile
        }
        const inferredTemplateId =
          s?.templateId ??
          (() => {
            try {
              const fileNames = Object.keys(files || {})
              if (fileNames.includes('main.py')) return 'fastapi'
              if (fileNames.includes('main.go')) return 'go'
              if (
                fileNames.some(
                  (f) => f.startsWith('src/app/') || f === 'next.config.ts'
                )
              )
                return 'next'
              if (
                fileNames.some((f) => f.startsWith('backend/')) &&
                fileNames.some((f) => f.startsWith('src/app/'))
              )
                return 'react_fastapi'
              if (
                fileNames.some(
                  (f) => f.startsWith('config/') && f.endsWith('.rb')
                )
              )
                return 'rails'
            } catch {
              /* noop */
            }
            return defaultTemplateId
          })()
        out[id] = {
          files,
          proposals: {},
          activeFile,
          folders: s?.folders,
          expandedFolders: Array.isArray(s?.expandedFolders)
            ? (s?.expandedFolders as string[])
            : [],
          input: '',
          loading: false,
          cancelling: false,
          model: s?.model || 'anthropic/claude-sonnet-4.5',
          activeThreadId: null,
          templateId: inferredTemplateId,
          sandbox: {
            sandboxId: s?.sandbox?.sandboxId,
            lastEditorSync: s?.sandbox?.lastEditorSync,
            lastSandboxSeen: s?.sandbox?.lastSandboxSeen,
          },
        }
      }
      for (const p of persisted?.projects || []) {
        if (!out[p.id]) {
          out[p.id] = {
            files: defaultTemplate.files,
            proposals: {},
            activeFile: defaultTemplate.defaultActiveFile,
            folders: undefined,
            expandedFolders: [],
            input: '',
            loading: false,
            cancelling: false,
            model: 'anthropic/claude-sonnet-4.5',
            activeThreadId: null,
            templateId: defaultTemplateId,
            sandbox: {},
            autoSyncing: false,
          }
        }
      }
      return out
    }
    const initial: Record<string, ProjectState> = {
      [initialProjectId]: {
        files: defaultTemplate.files,
        proposals: {},
        activeFile: defaultTemplate.defaultActiveFile,
        folders: undefined,
        expandedFolders: [],
        input: '',
        loading: false,
        cancelling: false,
        model: 'anthropic/claude-sonnet-4.5',
        activeThreadId: null,
        templateId: defaultTemplateId,
        sandbox: {},
        autoSyncing: false,
      },
    } as Record<string, ProjectState>
    return initial
  })

  // persist essential fields
  React.useEffect(() => {
    const projectStatesToPersist: Record<string, PersistedProjectState> = {}
    for (const [id, st] of Object.entries(projectStates)) {
      projectStatesToPersist[id] = {
        files: st.files,
        activeFile: st.activeFile,
        folders: st.folders,
        expandedFolders: st.expandedFolders,
        model: st.model,
        templateId: st.templateId,
        sandbox: st.sandbox
          ? {
              sandboxId: st.sandbox.sandboxId,
              lastEditorSync: st.sandbox.lastEditorSync,
              lastSandboxSeen: st.sandbox.lastSandboxSeen,
            }
          : undefined,
      }
    }
    const activeIdSafe = projects.some((p) => p.id === activeProjectId)
      ? activeProjectId
      : projects[0]?.id || ''
    const toSave: PersistedState = {
      version: 1,
      projects,
      activeProjectId: activeIdSafe,
      projectStates: projectStatesToPersist,
    }
    savePersistedState(toSave)
  }, [projects, activeProjectId, projectStates])

  const ensureProject = React.useCallback(
    (id: string) => {
      setProjectStates((prev) => {
        if (prev[id]) return prev
        const next: Record<string, ProjectState> = { ...prev } as Record<
          string,
          ProjectState
        >
        next[id] = {
          files: defaultTemplate.files,
          proposals: {},
          activeFile: defaultTemplate.defaultActiveFile,
          folders: undefined,
          expandedFolders: [],
          input: '',
          loading: false,
          cancelling: false,
          model: 'anthropic/claude-sonnet-4.5',
          activeThreadId: null,
          templateId: defaultTemplateId,
          sandbox: {},
        } as ProjectState
        return next
      })
    },
    [
      defaultTemplate.files,
      defaultTemplate.defaultActiveFile,
      defaultTemplateId,
    ]
  )

  const setActiveProjectId = React.useCallback(
    (id: string) => {
      ensureProject(id)
      setActiveProjectIdState(id)
    },
    [ensureProject]
  )

  // Derived active state getters/setters
  const activeState =
    projectStates[activeProjectId] ||
    ({
      files: {},
      proposals: {},
      activeFile: '',
      folders: undefined,
      expandedFolders: [],
      input: '',
      loading: false,
      cancelling: false,
      model: 'anthropic/claude-sonnet-4.5',
      activeThreadId: null,
      templateId: defaultTemplateId,
      sandbox: {},
    } as ProjectState)

  const setProject = React.useCallback(
    (updater: (prev: Record<string, string>) => Record<string, string>) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          files: updater(prev[activeProjectId].files),
        },
      }))
    },
    [activeProjectId]
  )

  const setProposals = React.useCallback(
    (updater: (prev: Record<string, string>) => Record<string, string>) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          proposals: updater(prev[activeProjectId].proposals),
        },
      }))
    },
    [activeProjectId]
  )

  const setActiveFile = React.useCallback(
    (file: string) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], activeFile: file },
      }))
    },
    [activeProjectId]
  )

  const setFolders = React.useCallback(
    (updater: (prev: string[] | undefined) => string[] | undefined) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          folders: updater(prev[activeProjectId].folders),
        },
      }))
    },
    [activeProjectId]
  )

  const setExpandedFolders = React.useCallback(
    (paths: string[]) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], expandedFolders: paths },
      }))
    },
    [activeProjectId]
  )

  const setInput = React.useCallback(
    (next: string) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], input: next },
      }))
    },
    [activeProjectId]
  )

  const setLoading = React.useCallback(
    (next: boolean) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], loading: next },
      }))
    },
    [activeProjectId]
  )

  const setCancelling = React.useCallback(
    (next: boolean) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], cancelling: next },
      }))
    },
    [activeProjectId]
  )

  const setModel = React.useCallback(
    (next: string) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], model: next },
      }))
    },
    [activeProjectId]
  )

  const setActiveThreadId = React.useCallback(
    (threadId: string | null) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          activeThreadId: threadId,
        },
      }))
    },
    [activeProjectId]
  )

  const setAutoSyncing = React.useCallback(
    (v: boolean) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], autoSyncing: v },
      }))
    },
    [activeProjectId]
  )

  // Expose helpers to update sandbox snapshots; these must be defined before any
  // callbacks that reference them (e.g., syncSandboxNow) to avoid TDZ issues.
  const setLastEditorSync = React.useCallback(
    (snapshot: Snapshot) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          sandbox: {
            ...prev[activeProjectId].sandbox,
            lastEditorSync: snapshot,
          },
        },
      }))
    },
    [activeProjectId]
  )

  const setLastSandboxSeen = React.useCallback(
    (snapshot: Snapshot, lastData?: Record<string, string>) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          sandbox: {
            ...prev[activeProjectId].sandbox,
            lastSandboxSeen: snapshot,
            ...(lastData ? { lastData } : {}),
          },
        },
      }))
    },
    [activeProjectId]
  )

  const syncSandboxNow = React.useCallback(async (): Promise<boolean> => {
    try {
      setAutoSyncing(true)
      const merged: Record<string, string> = { ...activeState.files }
      for (const [p, c] of Object.entries(activeState.proposals || {}))
        merged[p] = c as string
      const userId = getUserId()
      const resp = await fetch(`${API_BASE}/play/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          project_id: activeProjectId,
          project: merged,
        }),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (resp.ok && data && data.ok) {
        const hashes = computeProjectHashes(merged)
        const nowISO = new Date().toISOString()
        setLastEditorSync({ at: nowISO, fileHashes: hashes })
        setLastSandboxSeen({ at: nowISO, fileHashes: hashes })
        return true
      }
      return false
    } catch {
      return false
    } finally {
      setAutoSyncing(false)
    }
  }, [
    activeProjectId,
    activeState.files,
    activeState.proposals,
    setLastEditorSync,
    setLastSandboxSeen,
    setAutoSyncing,
  ])

  const setCode = React.useCallback(
    (next: string) => {
      setProject((prev) => ({ ...prev, [activeState.activeFile]: next }))
    },
    [activeState.activeFile, setProject]
  )

  const upsertProposal = React.useCallback(
    (filePath: string, newContent: string) => {
      setProposals((prev) => ({ ...prev, [filePath]: newContent }))
    },
    [setProposals]
  )

  const clearProposal = React.useCallback(
    (filePath: string) => {
      setProposals((prev) => {
        const next = { ...prev } as Record<string, string>
        delete next[filePath]
        return next
      })
    },
    [setProposals]
  )

  // ignore patterns
  const gitignoreText = activeState.files['.gitignore'] || ''
  const agentignoreText = activeState.files['.agentignore'] || ''
  const isPathIgnored = React.useMemo(() => {
    const sanitize = (s: string) => s.trim()
    const linesGit = gitignoreText
      ? gitignoreText
          .split(/\r?\n/)
          .map(sanitize)
          .filter((l) => l && !l.startsWith('#'))
      : []
    const linesAgent = agentignoreText
      ? agentignoreText
          .split(/\r?\n/)
          .map(sanitize)
          .filter((l) => l && !l.startsWith('#'))
      : []
    const patterns = [
      ...DEFAULT_DIFF_IGNORE_PATTERNS,
      ...linesGit,
      ...linesAgent,
    ]

    const toPredicate = (pat: string) => {
      const pattern = pat.replace(/^\//, '').trim()
      if (!pattern) return () => false

      if (pattern.endsWith('/')) {
        const dir = pattern.slice(0, -1)
        return (p: string) => {
          const n = (p || '').replace(/^\//, '')
          if (n === dir || n.startsWith(dir + '/')) return true
          return n.split('/').includes(dir)
        }
      }

      if (!pattern.includes('*') && !pattern.includes('?')) {
        return (p: string) => {
          const n = (p || '').replace(/^\//, '')
          const base = n.split('/').pop() || n
          return base === pattern
        }
      }

      const escapeRegex = (s: string) =>
        s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regexStr =
        '^' +
        pattern
          .split(/([*?])/)
          .map((tok) =>
            tok === '*' ? '.*' : tok === '?' ? '.' : escapeRegex(tok)
          )
          .join('') +
        '$'
      const regex = new RegExp(regexStr)
      return (p: string) => {
        const n = (p || '').replace(/^\//, '')
        const base = n.split('/').pop() || n
        if (regex.test(base)) return true
        return n.split('/').some((seg) => regex.test(seg))
      }
    }

    const predicates = patterns.map(toPredicate)
    return (p: string) => predicates.some((fn) => fn(p))
  }, [gitignoreText, agentignoreText])

  const projectForTree = React.useMemo(() => {
    const out: Record<string, string> = {}
    for (const [p, c] of Object.entries(activeState.files)) {
      if (!isPathIgnored(p) || p === activeState.activeFile)
        out[p] = c as string
    }
    return out
  }, [activeState.files, isPathIgnored, activeState.activeFile])

  const proposalsForTree = React.useMemo(() => {
    const out: Record<string, string> = {}
    for (const [p, c] of Object.entries(activeState.proposals)) {
      if (!isPathIgnored(p) || p === activeState.activeFile)
        out[p] = c as string
    }
    return out
  }, [activeState.proposals, isPathIgnored, activeState.activeFile])

  const projectForSend = React.useMemo(() => {
    const out: Record<string, string> = {}
    for (const [p, c] of Object.entries(activeState.files)) {
      if (!isPathIgnored(p) || p === '.gitignore' || p === '.agentignore')
        out[p] = c as string
    }
    return out
  }, [activeState.files, isPathIgnored])

  const proposalsForSend = React.useMemo(() => {
    const out: Record<string, string> = {}
    for (const [p, c] of Object.entries(activeState.proposals)) {
      if (!isPathIgnored(p)) out[p] = c as string
    }
    return out
  }, [activeState.proposals, isPathIgnored])

  // Sandbox snapshots and derived diffs
  const editorHashes: FileHashes = React.useMemo(
    () => computeProjectHashes(activeState.files, isPathIgnored),
    [activeState.files, isPathIgnored]
  )

  const sandboxHashes: FileHashes = React.useMemo(() => {
    return activeState.sandbox?.lastSandboxSeen?.fileHashes || {}
  }, [activeState.sandbox?.lastSandboxSeen])

  const baseHashes: FileHashes = React.useMemo(() => {
    return activeState.sandbox?.lastEditorSync?.fileHashes || {}
  }, [activeState.sandbox?.lastEditorSync])

  const { editorAheadPaths, sandboxAheadPaths, divergedPaths } =
    React.useMemo(() => {
      const hasBaseline = Boolean(
        activeState.sandbox?.lastEditorSync ||
          activeState.sandbox?.lastSandboxSeen
      )
      if (!hasBaseline) {
        return {
          editorAheadPaths: [],
          sandboxAheadPaths: [],
          divergedPaths: [],
        }
      }
      const allPaths = new Set<string>([
        ...Object.keys(editorHashes),
        ...Object.keys(sandboxHashes),
        ...Object.keys(baseHashes),
      ])
      const editorAhead: string[] = []
      const sandboxAhead: string[] = []
      const diverged: string[] = []
      for (const p of allPaths) {
        const e = editorHashes[p]
        const s = sandboxHashes[p]
        const b = baseHashes[p]
        const eNeqB = e !== b
        const sNeqB = s !== b
        if (eNeqB && !sNeqB) editorAhead.push(p)
        else if (!eNeqB && sNeqB) sandboxAhead.push(p)
        else if (eNeqB && sNeqB && e !== s) diverged.push(p)
      }
      return {
        editorAheadPaths: editorAhead.sort(),
        sandboxAheadPaths: sandboxAhead.sort(),
        divergedPaths: diverged.sort(),
      }
    }, [
      editorHashes,
      sandboxHashes,
      baseHashes,
      activeState.sandbox?.lastEditorSync,
      activeState.sandbox?.lastSandboxSeen,
    ])

  const sandboxStatus = React.useMemo(
    () => ({
      editorAhead: editorAheadPaths.length,
      sandboxAhead: sandboxAheadPaths.length,
      diverged: divergedPaths.length,
    }),
    [editorAheadPaths.length, sandboxAheadPaths.length, divergedPaths.length]
  )
  const hasSandboxBaseline = React.useMemo(
    () =>
      Boolean(
        activeState.sandbox?.lastEditorSync ||
          activeState.sandbox?.lastSandboxSeen
      ),
    [activeState.sandbox?.lastEditorSync, activeState.sandbox?.lastSandboxSeen]
  )

  const markSyncOnNextRun = React.useCallback(() => {
    setProjectStates((prev) => ({
      ...prev,
      [activeProjectId]: {
        ...prev[activeProjectId],
        sandbox: {
          ...prev[activeProjectId].sandbox,
          shouldSyncOnNextRun: true,
        },
      },
    }))
  }, [activeProjectId])

  const setSyncOnNextRun = React.useCallback(
    (v: boolean) => {
      setProjectStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          sandbox: { ...prev[activeProjectId].sandbox, shouldSyncOnNextRun: v },
        },
      }))
    },
    [activeProjectId]
  )

  // File operations with active-file and proposals consistency
  const createFile = React.useCallback(
    (name: string) => {
      const path = (name || '').replace(/^\//, '')
      if (!path) return
      setProject((prev) => ({ ...prev, [path]: '' }))
      setActiveFile(path)
    },
    [setProject, setActiveFile]
  )

  const renameFile = React.useCallback(
    (oldPath: string, newPath: string) => {
      setProject((prev) => {
        const content = prev[oldPath] ?? ''
        const next = { ...prev } as Record<string, string>
        delete next[oldPath]
        next[newPath] = content
        return next
      })
      setProposals((prev) => {
        if (!prev[oldPath]) return prev
        const next = { ...prev } as Record<string, string>
        const val = next[oldPath]
        delete next[oldPath]
        next[newPath] = val
        return next
      })
      if (activeState.activeFile === oldPath) setActiveFile(newPath)
    },
    [setProject, setProposals, setActiveFile, activeState.activeFile]
  )

  const deleteFile = React.useCallback(
    (filePath: string) => {
      setProject((prev) => {
        const next = { ...prev } as Record<string, string>
        delete next[filePath]
        return next
      })
      setProposals((prev) => {
        if (!prev[filePath]) return prev
        const next = { ...prev } as Record<string, string>
        delete next[filePath]
        return next
      })
      if (activeState.activeFile === filePath) {
        const remaining = Object.keys(activeState.files)
          .filter((p) => p !== filePath)
          .sort()
        setActiveFile(remaining[0] || '')
      }
    },
    [
      setProject,
      setProposals,
      activeState.activeFile,
      activeState.files,
      setActiveFile,
    ]
  )

  const moveFile = React.useCallback(
    (src: string, destDir: string) => {
      const fileName = src.split('/').pop() || src
      const dest = destDir
        ? `${destDir.replace(/\/$/, '')}/${fileName}`
        : fileName
      if (dest === src) return
      setProject((prev) => {
        const content = prev[src]
        const next = { ...prev } as Record<string, string>
        delete next[src]
        next[dest] = content ?? ''
        return next
      })
      setProposals((prev) => {
        if (!prev[src]) return prev
        const next = { ...prev } as Record<string, string>
        const val = next[src]
        delete next[src]
        next[dest] = val
        return next
      })
      if (activeState.activeFile === src) setActiveFile(dest)
    },
    [setProject, setProposals, activeState.activeFile, setActiveFile]
  )

  const createFolder = React.useCallback(
    (folderPath: string) => {
      setProject((prev) => ({ ...prev })) // no-op to trigger rebuild
      setFolders((prev) =>
        Array.from(new Set([...(prev || []), folderPath.replace(/^\//, '')]))
      )
    },
    [setProject, setFolders]
  )

  const deleteFolder = React.useCallback(
    (folderPath: string) => {
      const normalized = folderPath.replace(/\/$/, '')
      setProject((prev) => {
        const next: Record<string, string> = {}
        for (const [p, c] of Object.entries(prev)) {
          if (p === normalized || p.startsWith(normalized + '/')) continue
          next[p] = c as string
        }
        return next
      })
      setProposals((prev) => {
        const next: Record<string, string> = {}
        for (const [p, c] of Object.entries(prev)) {
          if (p === normalized || p.startsWith(normalized + '/')) continue
          next[p] = c as string
        }
        return next
      })
      setFolders((prev) =>
        (prev || []).filter(
          (f) => f !== normalized && !f.startsWith(normalized + '/')
        )
      )
      if (
        activeState.activeFile === normalized ||
        activeState.activeFile.startsWith(normalized + '/')
      ) {
        const remaining = Object.keys(activeState.files)
          .filter((p) => !(p === normalized || p.startsWith(normalized + '/')))
          .sort()
        setActiveFile(remaining[0] || '')
      }
    },
    [
      setProject,
      setProposals,
      setFolders,
      activeState.activeFile,
      activeState.files,
      setActiveFile,
    ]
  )

  const renameFolder = React.useCallback(
    (oldPath: string, newPath: string) => {
      const normalizedOld = oldPath.replace(/\/$/, '')
      const normalizedNew = newPath.replace(/^\//, '')
      setProject((prev) => {
        const next: Record<string, string> = {}
        for (const [p, c] of Object.entries(prev)) {
          if (p === normalizedOld || p.startsWith(normalizedOld + '/')) {
            const suffix = p.slice(normalizedOld.length)
            const np = (normalizedNew + suffix).replace(/^\//, '')
            next[np] = c as string
          } else {
            next[p] = c as string
          }
        }
        return next
      })
      setProposals((prev) => {
        const next: Record<string, string> = {}
        for (const [p, c] of Object.entries(prev)) {
          if (p === normalizedOld || p.startsWith(normalizedOld + '/')) {
            const suffix = p.slice(normalizedOld.length)
            const np = (normalizedNew + suffix).replace(/^\//, '')
            next[np] = c as string
          } else {
            next[p] = c as string
          }
        }
        return next
      })
      setFolders((prev) => {
        const base = prev || []
        const updated = base.map((f) =>
          f === normalizedOld || f.startsWith(normalizedOld + '/')
            ? (normalizedNew + f.slice(normalizedOld.length)).replace(/^\//, '')
            : f
        )
        if (!updated.includes(normalizedNew)) updated.push(normalizedNew)
        return Array.from(new Set(updated))
      })
      if (
        activeState.activeFile === normalizedOld ||
        activeState.activeFile.startsWith(normalizedOld + '/')
      ) {
        const suffix = activeState.activeFile.slice(normalizedOld.length)
        setActiveFile((normalizedNew + suffix).replace(/^\//, ''))
      }
    },
    [
      setProject,
      setProposals,
      setFolders,
      activeState.activeFile,
      setActiveFile,
    ]
  )

  const moveFolder = React.useCallback(
    (srcFolder: string, destDir: string) => {
      const normalizedSrc = srcFolder.replace(/\/$/, '')
      const dest = destDir ? destDir.replace(/\/$/, '') : ''
      if (dest === normalizedSrc || dest.startsWith(normalizedSrc + '/')) return
      const srcBase = (normalizedSrc.split('/').pop() || normalizedSrc).replace(
        /^\//,
        ''
      )
      const targetBase = dest ? `${dest}/${srcBase}` : srcBase
      setProject((prev) => {
        const next: Record<string, string> = {}
        for (const [p, c] of Object.entries(prev)) {
          if (p === normalizedSrc || p.startsWith(normalizedSrc + '/')) {
            const suffix = p.slice(normalizedSrc.length)
            const np = `${targetBase}${suffix}`.replace(/^\//, '')
            next[np] = c as string
          } else {
            next[p] = c as string
          }
        }
        return next
      })
      setProposals((prev) => {
        const next: Record<string, string> = {}
        for (const [p, c] of Object.entries(prev)) {
          if (p === normalizedSrc || p.startsWith(normalizedSrc + '/')) {
            const suffix = p.slice(normalizedSrc.length)
            const np = `${targetBase}${suffix}`.replace(/^\//, '')
            next[np] = c as string
          } else {
            next[p] = c as string
          }
        }
        return next
      })
      setFolders((prev) => {
        const base = prev || []
        const moved = base.map((f) => {
          if (f === normalizedSrc || f.startsWith(normalizedSrc + '/')) {
            const suffix = f.slice(normalizedSrc.length)
            return `${targetBase}${suffix}`.replace(/^\//, '')
          }
          return f
        })
        if (!moved.includes(targetBase)) moved.push(targetBase)
        return Array.from(new Set(moved.map((s) => s.replace(/^\//, ''))))
      })
      if (
        activeState.activeFile === normalizedSrc ||
        activeState.activeFile.startsWith(normalizedSrc + '/')
      ) {
        const suffix = activeState.activeFile.slice(normalizedSrc.length)
        setActiveFile(`${targetBase}${suffix}`.replace(/^\//, ''))
      }
    },
    [
      setProject,
      setProposals,
      setFolders,
      activeState.activeFile,
      setActiveFile,
    ]
  )

  // Upsert file only if missing (used by agent)
  const upsertFileIfMissing = React.useCallback(
    (filePath: string, content: string) => {
      if (isPathIgnored(filePath)) return
      const normalized = (filePath || '').replace(/^\//, '')
      setProject((prev) =>
        prev[normalized] !== undefined
          ? prev
          : { ...prev, [normalized]: content ?? '' }
      )
    },
    [setProject, isPathIgnored]
  )

  // Public project management operations
  const createProject = React.useCallback(
    (name: string, templateId: string) => {
      const id = `proj_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 7)}`
      const t =
        getTemplateById(templateId) ||
        getStackById(templateId) ||
        defaultTemplate
      setProjects((prev) => [...prev, { id, name }])
      setProjectStates((prev) => ({
        ...prev,
        [id]: {
          files: t.files,
          proposals: {},
          activeFile: t.defaultActiveFile,
          folders: undefined,
          expandedFolders: [],
          input: '',
          loading: false,
          cancelling: false,
          model: 'anthropic/claude-sonnet-4.5',
          activeThreadId: null,
          templateId,
          sandbox: {},
        },
      }))
      setActiveProjectId(id)
      return id
    },
    [setProjects, setProjectStates, setActiveProjectId, defaultTemplate]
  )

  const renameProject = React.useCallback((id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: name.trim() } : p))
    )
  }, [])

  const cloneProject = React.useCallback(
    (id: string, newName?: string) => {
      const source = projects.find((p) => p.id === id)
      if (!source) return null
      const srcState = projectStates[id]
      const existing = new Set(
        projects.map((p) => (p.name || '').trim().toLowerCase())
      )
      const base = (newName || source.name || 'Project').trim()
      const tryName = (n: number) =>
        n === 1 ? `${base} Copy` : `${base} Copy ${n}`
      let nameCandidate = tryName(1)
      for (
        let i = 1;
        i < 1000 && existing.has(nameCandidate.trim().toLowerCase());
        i += 1
      ) {
        nameCandidate = tryName(i + 1)
      }
      const newId = `proj_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 7)}`
      setProjects((prev) => [...prev, { id: newId, name: nameCandidate }])
      if (srcState) {
        setProjectStates((prev) => ({
          ...prev,
          [newId]: {
            files: { ...(srcState.files || {}) },
            proposals: {},
            activeFile: srcState.activeFile,
            folders: srcState.folders,
            expandedFolders: Array.isArray(srcState.expandedFolders)
              ? [...srcState.expandedFolders]
              : [],
            input: '',
            loading: false,
            cancelling: false,
            model: srcState.model,
            activeThreadId: null,
            templateId: srcState.templateId,
            sandbox: {},
          },
        }))
      }
      setActiveProjectId(newId)
      return newId
    },
    [projects, projectStates, setProjects, setProjectStates, setActiveProjectId]
  )

  const deleteProject = React.useCallback(
    (id: string) => {
      const wasLast = projects.length === 1 && projects[0]?.id === id
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setProjectStates((prev) => {
        const next = { ...prev } as Record<string, ProjectState>
        delete next[id]
        return next
      })
      if (wasLast) {
        setActiveProjectId('')
      } else if (activeProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id)
        const nextActive = remaining[0]?.id
        if (nextActive) setActiveProjectId(nextActive)
      }
    },
    [
      projects,
      activeProjectId,
      setProjects,
      setProjectStates,
      setActiveProjectId,
    ]
  )

  const setLoadingForProject = React.useCallback(
    (projectId: string, v: boolean) => {
      setProjectStates((prev) => {
        const current = prev[projectId]
        if (!current) return prev
        return { ...prev, [projectId]: { ...current, loading: v } }
      })
    },
    [setProjectStates]
  )

  const value: ProjectsContextValue = {
    projects,
    activeProjectId,
    setActiveProjectId,
    createProject,
    renameProject,
    cloneProject,
    deleteProject,
    project: activeState.files,
    proposals: activeState.proposals,
    activeFile: activeState.activeFile,
    folders: activeState.folders,
    expandedFolders: activeState.expandedFolders,
    setExpandedFolders,
    templateId: activeState.templateId,
    sandboxStatus,
    editorAheadPaths,
    sandboxAheadPaths,
    divergedPaths,
    setLastEditorSync,
    setLastSandboxSeen,
    markSyncOnNextRun,
    shouldSyncOnNextRun: Boolean(activeState.sandbox?.shouldSyncOnNextRun),
    setSyncOnNextRun,
    hasSandboxBaseline,
    isPathIgnored,
    projectForTree,
    proposalsForTree,
    projectForSend,
    proposalsForSend,
    setActiveFile,
    setCode,
    upsertProposal,
    clearProposal,
    upsertFileIfMissing,
    createFile,
    renameFile,
    deleteFile,
    moveFile,
    createFolder,
    renameFolder,
    deleteFolder,
    moveFolder,
    input: activeState.input,
    setInput,
    loading: activeState.loading,
    setLoading,
    setLoadingForProject,
    cancelling: activeState.cancelling,
    setCancelling,
    model: activeState.model,
    setModel,
    activeThreadId: activeState.activeThreadId,
    setActiveThreadId,
    sandboxLastData: activeState.sandbox?.lastData,
    autoSyncing: Boolean(activeState.autoSyncing),
    setAutoSyncing,
    syncSandboxNow,
  }

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects(): ProjectsContextValue {
  const ctx = React.useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider')
  return ctx
}
