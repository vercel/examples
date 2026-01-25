'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileCode2, Layout, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = async (template?: string) => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template ? `${template} Project` : 'New Project',
          template,
        }),
      })

      if (response.ok) {
        const { project } = await response.json()
        router.push(`/projects/${project.id}`)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const actions = [
    {
      title: 'New Project',
      description: 'Start from scratch',
      icon: Plus,
      color: 'bg-blue-500',
      onClick: () => handleCreateProject(),
    },
    {
      title: 'Next.js App',
      description: 'Full-stack React framework',
      icon: Layout,
      color: 'bg-zinc-700',
      onClick: () => handleCreateProject('nextjs'),
    },
    {
      title: 'React SPA',
      description: 'Single page application',
      icon: FileCode2,
      color: 'bg-cyan-500',
      onClick: () => handleCreateProject('react'),
    },
    {
      title: 'AI Assistant',
      description: 'Let AI decide the stack',
      icon: Sparkles,
      color: 'bg-purple-500',
      onClick: () => handleCreateProject('ai-generated'),
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.onClick}
            disabled={isCreating}
            className="group bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 text-left hover:border-zinc-600 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              {isCreating ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <action.icon className="h-5 w-5 text-white" />
              )}
            </div>
            <h3 className="font-medium text-white">{action.title}</h3>
            <p className="text-sm text-zinc-400 mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
