'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  useEveAgent,
  type UseEveAgentHelpers,
  type EveMessageData,
} from 'eve/react'
import { LoaderCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/components/settings/use-settings'
import { useSandboxStore } from '@/app/state'
import {
  PROJECT_KEY,
  projectSchema,
  savedProject,
  setActiveProject,
  type Project,
} from './project-client'

type ChatState = UseEveAgentHelpers<EveMessageData> & { newProject: () => void }
const ChatContext = createContext<ChatState | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string>()
  const pending = useRef<Promise<Project> | null>(null)

  async function createProject() {
    setError(undefined)
    if (!pending.current) {
      pending.current = fetch('/api/projects', { method: 'POST' }).then(
        async (response) => {
          if (!response.ok)
            throw new Error(
              (await response.json()).error ?? 'Could not open project'
            )
          return projectSchema.parse(await response.json())
        }
      )
    }
    try {
      const next = await pending.current
      localStorage.setItem(PROJECT_KEY, JSON.stringify(next))
      setActiveProject(next)
      useSandboxStore.getState().reset()
      setProject(next)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not open project'
      )
      toast.error(
        error instanceof Error ? error.message : 'Could not open project'
      )
    } finally {
      pending.current = null
    }
  }

  useEffect(() => {
    const saved = savedProject()
    if (saved) {
      setActiveProject(saved)
      setProject(saved)
    } else void createProject()
  }, [])

  if (!project)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 font-mono text-sm">
        {error ? (
          <>
            <p role="alert">{error}</p>
            <Button onClick={() => void createProject()}>Retry</Button>
          </>
        ) : (
          <>
            <LoaderCircleIcon className="size-5 animate-spin" />
            <p>Opening project...</p>
          </>
        )}
      </div>
    )
  return (
    <ProjectChat
      key={project.sessionId}
      project={project}
      newProject={() => void createProject()}
    >
      {children}
    </ProjectChat>
  )
}

function ProjectChat({
  project,
  newProject,
  children,
}: {
  project: Project
  newProject: () => void
  children: ReactNode
}) {
  const settings = useSettings()
  const appliedOutputs = useRef(new Map<string, string>())
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const chat = useEveAgent({
    host: '/api/agent',
    initialSession: { sessionId: project.sessionId, streamIndex: 0 },
    resume: true,
    headers: () => ({
      authorization: `Bearer ${project.token}`,
      'x-model-id': settingsRef.current.modelId,
      'x-reasoning-effort': settingsRef.current.reasoningEffort,
    }),
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    const store = useSandboxStore.getState()
    store.setChatStatus(chat.status)
    for (const message of chat.data.messages) {
      for (const part of message.parts) {
        if (
          part.type !== 'dynamic-tool' ||
          !('output' in part) ||
          !part.output ||
          typeof part.output !== 'object'
        )
          continue
        const serialized = JSON.stringify(part.output)
        if (appliedOutputs.current.get(part.toolCallId) === serialized) continue
        appliedOutputs.current.set(part.toolCallId, serialized)
        store.applyToolOutput(part.output)
      }
    }
  }, [chat.data.messages, chat.status])

  return (
    <ChatContext.Provider value={{ ...chat, newProject }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useSharedChatContext() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('ChatProvider is missing')
  return context
}
