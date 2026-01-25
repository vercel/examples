'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Layout,
  Server,
  Smartphone,
  Database,
  Bot,
  ShoppingCart,
  FileCode2,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: string
  prompt: string
  color: string
}

const TEMPLATES: Template[] = [
  {
    id: 'nextjs-app',
    name: 'Next.js App',
    description: 'Full-stack React application with App Router, TypeScript, and Tailwind CSS',
    icon: Layout,
    category: 'framework',
    prompt: 'Create a Next.js 14 application with App Router, TypeScript, Tailwind CSS, and a modern dashboard layout',
    color: 'bg-zinc-700',
  },
  {
    id: 'react-spa',
    name: 'React SPA',
    description: 'Single page application with React, Vite, and React Router',
    icon: FileCode2,
    category: 'framework',
    prompt: 'Create a React single page application with Vite, React Router, TypeScript, and Tailwind CSS',
    color: 'bg-cyan-500',
  },
  {
    id: 'api-server',
    name: 'API Server',
    description: 'REST API with Express.js, TypeScript, and OpenAPI documentation',
    icon: Server,
    category: 'backend',
    prompt: 'Create a REST API server with Express.js, TypeScript, Zod validation, and OpenAPI/Swagger documentation',
    color: 'bg-green-500',
  },
  {
    id: 'mobile-app',
    name: 'React Native',
    description: 'Cross-platform mobile app with Expo and React Native',
    icon: Smartphone,
    category: 'mobile',
    prompt: 'Create a React Native mobile app with Expo, TypeScript, and navigation',
    color: 'bg-purple-500',
  },
  {
    id: 'database-app',
    name: 'Full-Stack CRUD',
    description: 'Complete CRUD application with database, API, and frontend',
    icon: Database,
    category: 'fullstack',
    prompt: 'Create a full-stack CRUD application with Next.js, Prisma, SQLite, and a complete admin dashboard',
    color: 'bg-orange-500',
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    description: 'AI-powered chatbot with streaming responses',
    icon: Bot,
    category: 'ai',
    prompt: 'Create an AI chatbot application with Next.js, Vercel AI SDK, and a beautiful chat interface',
    color: 'bg-pink-500',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online store with product catalog and shopping cart',
    icon: ShoppingCart,
    category: 'fullstack',
    prompt: 'Create an e-commerce website with Next.js, product listings, shopping cart, and checkout flow',
    color: 'bg-yellow-500',
  },
  {
    id: 'ai-generated',
    name: 'AI Decides',
    description: 'Let AI analyze your needs and suggest the best stack',
    icon: Sparkles,
    category: 'ai',
    prompt: 'Analyze my requirements and create the most appropriate project structure',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
]

interface TemplatePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (template: Template) => void
}

export function TemplatePicker({ isOpen, onClose, onSelect }: TemplatePickerProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const categories = [
    { id: null, name: 'All' },
    { id: 'framework', name: 'Frameworks' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full-Stack' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'ai', name: 'AI' },
  ]

  const filteredTemplates = selectedCategory
    ? TEMPLATES.filter((t) => t.category === selectedCategory)
    : TEMPLATES

  const handleSelectTemplate = async (template: Template) => {
    if (onSelect) {
      onSelect(template)
      onClose()
      return
    }

    setSelectedTemplate(template)
    setIsCreating(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${template.name} Project`,
          description: template.description,
          template: template.id,
        }),
      })

      if (response.ok) {
        const { project } = await response.json()
        router.push(`/?project=${project.id}&prompt=${encodeURIComponent(template.prompt)}`)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsCreating(false)
      setSelectedTemplate(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Choose a Template</h2>
            <p className="text-sm text-zinc-400">
              Start with a pre-configured project template
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-6 py-3 border-b border-zinc-800 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id ?? 'all'}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                disabled={isCreating}
                className="group text-left bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 hover:border-zinc-600 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className={`${template.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {isCreating && selectedTemplate?.id === template.id ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <template.icon className="h-6 w-6 text-white" />
                  )}
                </div>
                <h3 className="font-medium text-white mb-1">{template.name}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-700 flex justify-between items-center">
          <p className="text-sm text-zinc-500">
            Or start from scratch in the editor
          </p>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export { TEMPLATES }
export type { Template }
