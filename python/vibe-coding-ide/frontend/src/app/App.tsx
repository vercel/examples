import React, { useState } from 'react'
import JSZipLib from 'jszip'
import { useAgentStream } from '../hooks/useAgentStream'
import { useAgentEvents } from '../hooks/useAgentEvents'
import { useChat } from '../hooks/useChat'
import { useRuns } from '../context/RunContext'
import { ChatTimeline } from '../components/Chat/ChatTimeline'
import { ChatInput } from '../components/Chat/ChatInput'
import { ModelPicker } from '../components/Chat/ModelPicker'
import ThreePane from '../components/ThreePane'
import { FileTree } from '../components/Editor/FileTree'
import ResizableCenter from '../components/ResizableCenter'
import { CodeFixModal } from '../components/CodeFixModal'
import ProjectTabs from '../components/ProjectTabs'
import NewProjectModal from '../components/NewProjectModal'
import { getTemplateById, getStackById } from '../templates'
import {
  getProjectChatThreads,
  setCurrentChatThread,
  startNewChatThread,
  upsertCurrentChatThread,
  mergeThreadIntoRuns,
  upsertThreadById,
  deleteChatThread,
  type PersistedChatThread,
  MAX_THREADS_PER_PROJECT,
} from '../lib/persistence'
import { History as HistoryIcon, Plus, X } from 'lucide-react'
import { useProjects } from '../context/ProjectsContext'
import { ensureGlobalUserId } from '../lib/user'

// Ensure a stable user id available globally and persisted
ensureGlobalUserId()
const USER_ID = ensureGlobalUserId()

function App() {
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    project,
    proposals,
    activeFile,
    folders,
    expandedFolders,
    setExpandedFolders,
    isPathIgnored,
    projectForTree,
    proposalsForTree,
    projectForSend,
    proposalsForSend,
    setActiveFile,
    setCode,
    clearProposal,
    createFile,
    createFolder,
    renameFile,
    deleteFile,
    moveFile,
    moveFolder,
    renameFolder,
    deleteFolder,
    input,
    setInput,
    loading,
    setLoading,
    cancelling,
    setCancelling,
    model,
    setModel,
    activeThreadId,
    setActiveThreadId,
    templateId,
    renameProject,
    cloneProject,
    deleteProject,
    upsertFileIfMissing,
    createProject,
  } = useProjects()
  const [showNewProject, setShowNewProject] = useState<boolean>(false)

  // Empty projects state flag (used for conditional rendering)
  const isNoProjects = projects.length === 0
  const [codeFix, setCodeFix] = useState<{
    fileName: string
    startLine: number
    endLine: number
    selectedCode: string
  } | null>(null)
  const nextProjectName = React.useMemo(
    () => `Project ${projects.length + 1}`,
    [projects.length]
  )

  const code = project[activeFile] ?? ''
  // Runs context
  const { runs, runOrder, mergeProjectRuns } = useRuns()

  // ---------------- Chat persistence / history ----------------
  const [chatThreads, setChatThreads] = useState<PersistedChatThread[]>(() =>
    getProjectChatThreads(activeProjectId)
  )
  const [showChatHistory, setShowChatHistory] = useState<boolean>(false)
  const chatHistoryRef = React.useRef<HTMLDivElement | null>(null)

  // Close chat history when clicking outside of its container
  React.useEffect(() => {
    if (!showChatHistory) return
    const handleDocMouseDown = (e: MouseEvent) => {
      const root = chatHistoryRef.current
      if (root && !root.contains(e.target as Node)) {
        setShowChatHistory(false)
      }
    }
    document.addEventListener('mousedown', handleDocMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleDocMouseDown)
    }
  }, [showChatHistory])

  // Keep a memo of last human message timestamps to avoid flicker (only refresh list when a thread's last human time changes)
  const lastHumanAtByThreadRef = React.useRef<
    Record<string, string | undefined>
  >({})

  // When project changes, load its threads and merge all into memory (do not clear to avoid dropping active streams)
  React.useEffect(() => {
    const threads = getProjectChatThreads(activeProjectId)
    setChatThreads(threads)
    if (threads && threads.length > 0) {
      for (const t of threads) {
        const { runs: scopedRuns, order } = mergeThreadIntoRuns(
          activeProjectId,
          t
        )
        mergeProjectRuns(activeProjectId, scopedRuns, order, t.id)
      }
      // Set active thread to most recent if none selected
      if (!activeThreadId)
        setActiveThreadId(threads[0]?.id || `${activeProjectId}_default`)
    } else {
      // Ensure we have a default active thread id even with no threads
      if (!activeThreadId) setActiveThreadId(`${activeProjectId}_default`)
    }
  }, [activeProjectId, mergeProjectRuns, activeThreadId, setActiveThreadId])

  // As runs change for this project, persist per-thread so background chats are saved too
  // Only refresh the thread list if lastHumanAt changed (i.e., a user_message), to prevent flicker during logs/tool updates
  React.useEffect(() => {
    // Group runs by thread within the active project
    const grouped: Record<
      string,
      { runs: Record<string, (typeof runs)[string]>; order: string[] }
    > = {}
    for (const id of runOrder) {
      const r = runs[id]
      if (!r || r.projectId !== activeProjectId) continue
      const tid = r.threadId || `${activeProjectId}_default`
      if (!grouped[tid]) grouped[tid] = { runs: {}, order: [] }
      grouped[tid].runs[id] = r
      grouped[tid].order.push(id)
    }
    // If nothing yet, ensure at least a default thread exists to keep UX consistent
    if (Object.keys(grouped).length === 0) {
      upsertCurrentChatThread(activeProjectId, {}, [])
      // Do not refresh list; no user message
      return
    }
    // Upsert all threads
    for (const [threadId, data] of Object.entries(grouped)) {
      upsertThreadById(activeProjectId, threadId, data.runs, data.order)
    }
    // Compute lastHumanAt map for this project from grouped data
    const newMap: Record<string, string | undefined> = {}
    for (const [tid, data] of Object.entries(grouped)) {
      let latest = 0
      for (const rid of data.order) {
        const run = data.runs[rid]
        if (!run) continue
        for (const a of run.actions) {
          if (a.kind === 'user_message' && a.timestamp) {
            const t = Date.parse(a.timestamp)
            if (!Number.isNaN(t) && t > latest) latest = t
          }
        }
      }
      newMap[tid] = latest > 0 ? new Date(latest).toISOString() : undefined
    }
    // Decide whether to refresh the UI list
    const prevMap = lastHumanAtByThreadRef.current
    let changed = false
    const keys = new Set([...Object.keys(prevMap), ...Object.keys(newMap)])
    for (const k of keys) {
      if (prevMap[k] !== newMap[k]) {
        changed = true
        break
      }
    }
    lastHumanAtByThreadRef.current = newMap
    if (changed) {
      setChatThreads(getProjectChatThreads(activeProjectId))
    }
  }, [runs, runOrder, activeProjectId])

  const openCodeFix = React.useCallback(
    (args: {
      fileName: string
      startLine: number
      endLine: number
      selectedCode: string
    }) => {
      setCodeFix(args)
    },
    [setCodeFix]
  )

  const closeCodeFix = React.useCallback(() => setCodeFix(null), [setCodeFix])

  // Declare placeholder for send function; assign later after hook is initialized
  const submitCodeFixRef = React.useRef<
    null | ((instruction: string) => Promise<void>)
  >(null)
  const submitCodeFix = React.useCallback(async (instruction: string) => {
    if (submitCodeFixRef.current) await submitCodeFixRef.current(instruction)
  }, [])

  const timelineActions = React.useMemo(() => {
    return runOrder
      .map((id) => runs[id])
      .filter((r): r is (typeof runs)[string] => Boolean(r))
      .filter(
        (run) =>
          (run.projectId || undefined) === activeProjectId &&
          (activeThreadId ? run.threadId === activeThreadId : true)
      )
      .flatMap((run) => run.actions || [])
  }, [runOrder, runs, activeProjectId, activeThreadId])

  // Only show thinking spinner for the latest run in the active thread
  const threadRunIds = React.useMemo(() => {
    return runOrder.filter((id) => {
      const r = runs[id]
      if (!r) return false
      if (r.projectId !== activeProjectId) return false
      const tid = r.threadId || `${activeProjectId}_default`
      return tid === (activeThreadId || `${activeProjectId}_default`)
    })
  }, [runOrder, runs, activeProjectId, activeThreadId])

  const latestRunId =
    threadRunIds.length > 0 ? threadRunIds[threadRunIds.length - 1] : null

  // Map SSE events to UI actions and create the stream controller
  const isActiveRun = React.useCallback(
    (taskId: string) => taskId === latestRunId,
    [latestRunId]
  )
  const handleAgentEvent = useAgentEvents({
    onRefreshPreview: () => {
      setPreviewRefreshToken((t) => t + 1)
    },
    isActiveRun,
  })
  const stream = useAgentStream({ onMessage: handleAgentEvent })

  // Derive thinking from final answer presence and basic run lifecycle
  const latestRun = latestRunId ? runs[latestRunId] : undefined
  const latestRunStatus = latestRun?.status
  const latestRunConnected = latestRunId
    ? stream.isConnected(latestRunId)
    : false
  const latestRunHasFinalAnswer = Boolean(
    latestRun?.actions?.some((a) => a.kind === 'final_answer')
  )
  const isThinking = Boolean(
    latestRunId &&
      !latestRunHasFinalAnswer &&
      (latestRunConnected || latestRunStatus === 'waiting_exec')
  )

  // Token to force refresh of preview iframes
  const [previewRefreshToken, setPreviewRefreshToken] = useState<number>(0)

  // Initialize chat functionality
  const { sendPrompt, cancelCurrentTask } = useChat({
    userId: USER_ID,
    input,
    cancelling,
    project: projectForSend,
    proposals: proposalsForSend,
    projectId: activeProjectId,
    threadId: activeThreadId || `${activeProjectId}_default`,
    setInput,
    setLoading,
    setCancelling,
    stream,
    model,
  })

  // Ensure code-fix submit is bound to the sendPrompt
  React.useEffect(() => {
    submitCodeFixRef.current = async (instruction: string) => {
      setInput(`Fix the following code:\n\n${instruction}`)
      await sendPrompt()
    }
  }, [sendPrompt, setInput])

  // Initialize the submitCodeFix callback after sendPrompt is available
  React.useEffect(() => {
    submitCodeFixRef.current = async (instruction: string) => {
      const args = codeFix // capture current
      if (!args) return
      const systemPrompt = `Please update ${args.fileName} between lines ${args.startLine}-${args.endLine} according to the user's instruction. Only make minimal, precise edits within that range using the edit_code tool. Preserve style and indentation. Selected code snippet for reference (do not paste with line numbers):\n\n${args.selectedCode}`
      setInput(`${instruction}\n\n${systemPrompt}`)
      setCodeFix(null)
      if (!isThinking) {
        await sendPrompt()
      }
    }
  }, [codeFix, setInput, isThinking, sendPrompt, setCodeFix])

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return
    await sendPrompt()
  }

  const handleCancelTask = () => {
    // Cancel only if the latest run is the active thinking one
    if (latestRunId && isThinking && !cancelling) {
      cancelCurrentTask(latestRunId)
    }
  }

  const handleNewChat = React.useCallback(() => {
    const newThread = startNewChatThread(activeProjectId)
    setChatThreads(getProjectChatThreads(activeProjectId))
    setActiveThreadId(newThread.id)
    // Reset UI state for this project to focus on new chat
    setInput('')
    setLoading(false)
    setCancelling(false)
  }, [activeProjectId, setInput, setLoading, setCancelling, setActiveThreadId])

  return (
    <>
      <ThreePane
        header={
          <ProjectTabs
            projects={projects}
            activeProjectId={activeProjectId}
            onSelect={(id) => {
              if (id === activeProjectId) return
              setActiveProjectId(id)
            }}
            onAdd={() => {
              setShowNewProject(true)
            }}
            onRename={(id, name) => {
              if (!name || !name.trim()) return
              renameProject(id, name.trim())
            }}
            onClone={(id) => {
              cloneProject(id)
            }}
            onDelete={(id) => {
              if (
                !window.confirm(
                  'Delete this project? This cannot be undone in this session.'
                )
              )
                return
              const wasLast = projects.length === 1 && projects[0]?.id === id
              deleteProject(id)
              if (wasLast) setShowNewProject(true)
            }}
            onDownload={async () => {
              try {
                const zip = new JSZipLib()
                const rootName = (
                  projects.find((p) => p.id === activeProjectId)?.name ||
                  'project'
                ).replace(/\s+/g, '_')
                const folder = zip.folder(rootName) ?? zip
                // Include all current project files; proposals are suggestions only
                Object.entries(project).forEach(([path, content]) => {
                  const normalized = (path || '').replace(/^\//, '')
                  if (!normalized) return
                  folder.file(normalized, content ?? '')
                })
                const blob = await zip.generateAsync({ type: 'blob' })
                const a = document.createElement('a')
                const url = URL.createObjectURL(blob)
                a.href = url
                a.download = `${rootName}.zip`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              } catch (e) {
                console.error('Failed to download ZIP', e)
              }
            }}
          />
        }
        left={
          isNoProjects ? (
            <div
              className="p-4 text-sm"
              style={{ color: 'var(--vscode-muted)' }}
            >
              No project. Create a new one to get started.
            </div>
          ) : (
            <FileTree
              project={projectForTree}
              activeFile={activeFile}
              onSelect={setActiveFile}
              onCreateFile={(name) => {
                createFile(name)
              }}
              onCreateFolder={(folderPath) => {
                createFolder(folderPath)
              }}
              onRename={(oldPath, newPath) => {
                renameFile(oldPath, newPath)
              }}
              onDelete={(path) => {
                deleteFile(path)
              }}
              onMoveFile={(src, destDir) => {
                moveFile(src, destDir)
              }}
              onMoveFolder={(srcFolder, destDir) => {
                moveFolder(srcFolder, destDir)
              }}
              proposed={proposalsForTree}
              folders={folders}
              expandedPaths={expandedFolders}
              onExpandedChange={setExpandedFolders}
              onRenameFolder={(oldPath, newPath) => {
                renameFolder(oldPath, newPath)
              }}
              onDeleteFolder={(folderPath) => {
                deleteFolder(folderPath)
              }}
            />
          )
        }
        center={
          isNoProjects ? (
            <div className="flex-1 flex items-center justify-center">
              <button
                onClick={() => setShowNewProject(true)}
                className="px-3 py-1 rounded-sm"
                style={{
                  background: 'var(--vscode-accent)',
                  color: '#ffffff',
                  border: '1px solid var(--vscode-panel-border)',
                }}
              >
                Create new project
              </button>
            </div>
          ) : (
            <ResizableCenter
              code={code}
              setCode={setCode}
              proposals={proposals}
              clearProposal={clearProposal}
              activeFile={activeFile}
              onSelectFile={setActiveFile}
              terminalLogs={''}
              onClearLogs={() => {}}
              isIgnored={isPathIgnored}
              // When editor requests a code fix open modal
              onRequestCodeFix={openCodeFix}
            />
          )
        }
        right={
          isNoProjects ? (
            <div
              className="p-4 text-sm"
              style={{ color: 'var(--vscode-muted)' }}
            />
          ) : (
            <>
              <div
                className="px-4 py-2 flex items-center gap-2"
                style={{ borderBottom: '1px solid var(--vscode-panel-border)' }}
              >
                <button
                  onClick={handleNewChat}
                  className="w-8 h-8 rounded-sm flex items-center justify-center"
                  style={{
                    background: 'var(--vscode-surface)',
                    color: 'var(--vscode-text)',
                    border: '1px solid var(--vscode-panel-border)',
                  }}
                  title="Start a new chat"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="relative">
                  {/* Container ref to detect outside clicks and close chat history */}
                  <div ref={chatHistoryRef} className="contents">
                    <button
                      onClick={() => setShowChatHistory((v) => !v)}
                      className="w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{
                        background: 'var(--vscode-surface)',
                        color: 'var(--vscode-text)',
                        border: '1px solid var(--vscode-panel-border)',
                      }}
                      title={`Show chat history (keeps up to ${MAX_THREADS_PER_PROJECT})`}
                    >
                      <HistoryIcon className="w-4 h-4" />
                    </button>
                    {showChatHistory && (
                      <div
                        className="absolute z-10 mt-2 p-2 rounded-sm w-64"
                        style={{
                          background: 'var(--vscode-panel)',
                          border: '1px solid var(--vscode-panel-border)',
                        }}
                      >
                        {chatThreads.length === 0 ? (
                          <div
                            className="text-xs"
                            style={{ color: 'var(--vscode-muted)' }}
                          >
                            No previous chats
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {chatThreads.map((t) => (
                              <div
                                key={t.id}
                                className={`flex items-center gap-2 group`}
                              >
                                <button
                                  className={`flex-1 text-left px-2 py-1 rounded-sm text-xs ${
                                    activeThreadId === t.id ? 'ring-1' : ''
                                  }`}
                                  style={{
                                    background: 'var(--vscode-contrast)',
                                    color: 'var(--vscode-text)',
                                    border:
                                      '1px solid var(--vscode-panel-border)',
                                  }}
                                  title={new Date(t.createdAt).toLocaleString()}
                                  onClick={() => {
                                    const chosen = setCurrentChatThread(
                                      activeProjectId,
                                      t.id
                                    )
                                    if (chosen) {
                                      const { runs: scopedRuns, order } =
                                        mergeThreadIntoRuns(
                                          activeProjectId,
                                          chosen
                                        )
                                      mergeProjectRuns(
                                        activeProjectId,
                                        scopedRuns,
                                        order,
                                        chosen.id
                                      )
                                      // Do not refresh chatThreads list here to avoid flicker; just set active
                                      setActiveThreadId(chosen.id)
                                      setShowChatHistory(false)
                                    }
                                  }}
                                >
                                  {t.title || `Chat`}
                                </button>
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded-sm opacity-70 group-hover:opacity-100 cursor-pointer"
                                  style={{
                                    background: 'var(--vscode-surface)',
                                    color: 'var(--vscode-text)',
                                    border:
                                      '1px solid var(--vscode-panel-border)',
                                  }}
                                  title="Delete chat"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Delete from persistence
                                    deleteChatThread(activeProjectId, t.id)
                                    const nextList =
                                      getProjectChatThreads(activeProjectId)
                                    setChatThreads(nextList)
                                    // If we just deleted the active thread, select next available or default
                                    if (activeThreadId === t.id) {
                                      const fallback =
                                        nextList[0]?.id ||
                                        `${activeProjectId}_default`
                                      setActiveThreadId(fallback)
                                      const chosen = nextList.find(
                                        (x: { id: string }) => x.id === fallback
                                      )
                                      if (chosen) {
                                        const { runs: scopedRuns, order } =
                                          mergeThreadIntoRuns(
                                            activeProjectId,
                                            chosen
                                          )
                                        mergeProjectRuns(
                                          activeProjectId,
                                          scopedRuns,
                                          order,
                                          chosen.id
                                        )
                                      }
                                    }
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ChatTimeline
                actions={timelineActions}
                isEmpty={timelineActions.length === 0}
                loading={isThinking}
                refreshToken={previewRefreshToken}
                onOpenFile={(path) => {
                  const normalized = (path || '').replace(/^\//, '')
                  if (!normalized) return
                  if (!project[normalized]) {
                    // If the file exists only as a proposal, open it (to view with proposedContent)
                    if (proposals[normalized] !== undefined) {
                      upsertFileIfMissing(normalized, project[normalized] ?? '')
                    } else {
                      // Otherwise do nothing
                    }
                  }
                  setActiveFile(normalized)
                }}
              />
              <div className="px-4 py-2">
                <ModelPicker value={model} onChange={setModel} />
              </div>
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSendMessage}
                sendDisabled={isThinking}
                showCancel={!!latestRunId && isThinking}
                onCancel={handleCancelTask}
                cancelling={cancelling}
                suggestions={(() => {
                  if (timelineActions.length > 0 || loading) return undefined
                  const tid = templateId
                  const tmpl = getTemplateById(tid) || getStackById(tid)
                  const list =
                    tmpl?.suggestions && tmpl.suggestions.length > 0
                      ? tmpl!.suggestions
                      : [
                          'Create a minimal Python API with FastAPI and run',
                          'Add /health and /time endpoints with basic request logging and run',
                          'Implement /text/wordcount that accepts JSON and returns counts and run',
                        ]
                  return list
                })()}
              />
              <div className="px-4 py-2 text-xs text-gray-500" />
            </>
          )
        }
      />
      <NewProjectModal
        visible={showNewProject}
        defaultName={nextProjectName}
        existingNames={projects.map((p) => p.name)}
        onClose={() => setShowNewProject(false)}
        onCreate={(name, templateId) => {
          createProject(name, templateId)
          setShowNewProject(false)
        }}
      />
      <CodeFixModal
        visible={!!codeFix}
        fileName={codeFix?.fileName || ''}
        startLine={codeFix?.startLine || 0}
        endLine={codeFix?.endLine || 0}
        selectedCode={codeFix?.selectedCode || ''}
        onClose={closeCodeFix}
        onSubmit={submitCodeFix}
      />
    </>
  )
}

export default App
