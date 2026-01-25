'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Play,
  Save,
  Settings,
  Share2,
  ExternalLink,
  MessageSquare,
  FileCode2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: string
  content: string
  createdAt: Date
}

interface Conversation {
  id: string
  title: string | null
  messages: Message[]
  updatedAt: Date
}

interface GeneratedFile {
  id: string
  path: string
  content: string
  language: string | null
}

interface Project {
  id: string
  name: string
  description: string | null
  sandboxId: string | null
  sandboxUrl: string | null
  template: string | null
  isPublic: boolean
  conversations: Conversation[]
  files: GeneratedFile[]
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface ProjectEditorProps {
  project: Project
  isOwner: boolean
  currentUser: {
    id?: string
    name?: string | null
    email?: string | null
  }
}

export function ProjectEditor({ project, isOwner }: ProjectEditorProps) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(
    project.files[0] || null
  )
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'files' | 'chat'>('files')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save logic here
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsSaving(false)
    }
  }

  const activeConversation = project.conversations[0]

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Header */}
      <header className="bg-zinc-800/50 border-b border-zinc-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-xs text-zinc-400">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.sandboxUrl && (
              <a
                href={project.sandboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Preview
              </a>
            )}

            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-600"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-600"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                <Link href={`/projects/${project.id}/settings`}>
                  <Button variant="outline" size="sm" className="border-zinc-600">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}

            <Link href={`/?project=${project.id}`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Continue in Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-800/30 border-r border-zinc-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-zinc-700">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'files'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileCode2 className="h-4 w-4 inline mr-2" />
              Files ({project.files.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Chat
            </button>
          </div>

          {/* File List */}
          {activeTab === 'files' && (
            <div className="flex-1 overflow-y-auto p-2">
              {project.files.length === 0 ? (
                <div className="text-center text-zinc-500 py-8">
                  <FileCode2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No files yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {project.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedFile?.id === file.id
                          ? 'bg-zinc-700 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                      }`}
                    >
                      <span className="truncate block">{file.path}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat History */}
          {activeTab === 'chat' && activeConversation && (
            <div className="flex-1 overflow-y-auto p-2">
              {activeConversation.messages.length === 0 ? (
                <div className="text-center text-zinc-500 py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeConversation.messages.slice(0, 10).map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-lg text-xs ${
                        message.role === 'user'
                          ? 'bg-blue-500/10 text-blue-300'
                          : 'bg-zinc-700/50 text-zinc-300'
                      }`}
                    >
                      <span className="font-medium capitalize">
                        {message.role}:
                      </span>{' '}
                      <span className="line-clamp-2">{message.content}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              <div className="bg-zinc-800/50 border-b border-zinc-700 px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-zinc-300">{selectedFile.path}</span>
                {selectedFile.language && (
                  <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">
                    {selectedFile.language}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto bg-zinc-950 p-4">
                <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">
                  {selectedFile.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <FileCode2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to view its contents</p>
                <p className="text-sm mt-2">
                  Or{' '}
                  <Link href={`/?project=${project.id}`} className="text-blue-400 hover:text-blue-300">
                    continue in the editor
                  </Link>{' '}
                  to generate more code
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
