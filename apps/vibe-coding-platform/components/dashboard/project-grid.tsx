'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FolderKanban,
  Star,
  StarOff,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  MessageSquare,
  FileCode2,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  template: string | null
  isFavorite: boolean
  sandboxUrl: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    conversations: number
    files: number
  }
}

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const router = useRouter()
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const handleToggleFavorite = async (e: React.MouseEvent, projectId: string, currentValue: boolean) => {
    e.preventDefault()
    e.stopPropagation()

    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: !currentValue }),
    })

    router.refresh()
  }

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    })

    setMenuOpenId(null)
    router.refresh()
  }

  if (projects.length === 0) {
    return (
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
        <FolderKanban className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
        <p className="text-zinc-400 mb-4">
          Create your first project to get started
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Create Project
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="group bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <FolderKanban className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                {project.template && (
                  <span className="text-xs text-zinc-500">{project.template}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => handleToggleFavorite(e, project.id, project.isFavorite)}
                className="p-1.5 text-zinc-400 hover:text-yellow-400 transition-colors"
              >
                {project.isFavorite ? (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMenuOpenId(menuOpenId === project.id ? null : project.id)
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {menuOpenId === project.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setMenuOpenId(null)
                      }}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20">
                      {project.sandboxUrl && (
                        <a
                          href={project.sandboxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Preview
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Clone functionality
                          setMenuOpenId(null)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, project.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-700/50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {project.description && (
            <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {project._count.conversations}
              </span>
              <span className="flex items-center gap-1">
                <FileCode2 className="h-3 w-3" />
                {project._count.files}
              </span>
            </div>
            <span>
              {formatDistanceToNow(new Date(project.updatedAt))}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
