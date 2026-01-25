'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Search,
  Filter,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileText,
  Image,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Download,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
  content?: string
  language?: string
  size?: number
  modifiedAt?: Date
}

interface EnhancedFileExplorerProps {
  files: FileNode[]
  selectedFile?: string
  onFileSelect: (file: FileNode) => void
  onFileRename?: (file: FileNode, newName: string) => void
  onFileDelete?: (file: FileNode) => void
  onFileCopy?: (file: FileNode) => void
  onFileDownload?: (file: FileNode) => void
}

// File type icons
const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()

  const iconMap: Record<string, React.ReactNode> = {
    js: <FileCode className="h-4 w-4 text-yellow-400" />,
    jsx: <FileCode className="h-4 w-4 text-yellow-400" />,
    ts: <FileCode className="h-4 w-4 text-blue-400" />,
    tsx: <FileCode className="h-4 w-4 text-blue-400" />,
    json: <FileJson className="h-4 w-4 text-yellow-300" />,
    md: <FileText className="h-4 w-4 text-gray-400" />,
    txt: <FileText className="h-4 w-4 text-gray-400" />,
    png: <Image className="h-4 w-4 text-purple-400" />,
    jpg: <Image className="h-4 w-4 text-purple-400" />,
    jpeg: <Image className="h-4 w-4 text-purple-400" />,
    gif: <Image className="h-4 w-4 text-purple-400" />,
    svg: <Image className="h-4 w-4 text-orange-400" />,
    css: <FileCode className="h-4 w-4 text-blue-300" />,
    scss: <FileCode className="h-4 w-4 text-pink-400" />,
    html: <FileCode className="h-4 w-4 text-orange-400" />,
    py: <FileCode className="h-4 w-4 text-green-400" />,
  }

  return iconMap[ext || ''] || <File className="h-4 w-4 text-zinc-400" />
}

// File type filters
const fileFilters = [
  { label: 'All', value: 'all' },
  { label: 'Code', value: 'code', extensions: ['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'java'] },
  { label: 'Styles', value: 'styles', extensions: ['css', 'scss', 'sass', 'less'] },
  { label: 'Data', value: 'data', extensions: ['json', 'yaml', 'yml', 'xml', 'toml'] },
  { label: 'Docs', value: 'docs', extensions: ['md', 'mdx', 'txt', 'pdf'] },
  { label: 'Images', value: 'images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'] },
]

export function EnhancedFileExplorer({
  files,
  selectedFile,
  onFileSelect,
  onFileRename,
  onFileDelete,
  onFileCopy,
  onFileDownload,
}: EnhancedFileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [renamingFile, setRenamingFile] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [contextMenu, setContextMenu] = useState<{ file: FileNode; x: number; y: number } | null>(null)

  // Filter files based on search and type filter
  const filteredFiles = useMemo(() => {
    const filterFile = (file: FileNode): FileNode | null => {
      // Search filter
      if (searchQuery) {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
        if (file.type === 'file' && !matchesSearch) return null
      }

      // Type filter
      if (activeFilter !== 'all' && file.type === 'file') {
        const filter = fileFilters.find((f) => f.value === activeFilter)
        if (filter?.extensions) {
          const ext = file.name.split('.').pop()?.toLowerCase()
          if (!ext || !filter.extensions.includes(ext)) return null
        }
      }

      // Handle folders
      if (file.type === 'folder' && file.children) {
        const filteredChildren = file.children
          .map(filterFile)
          .filter((f): f is FileNode => f !== null)

        if (filteredChildren.length === 0 && searchQuery) return null

        return { ...file, children: filteredChildren }
      }

      return file
    }

    return files.map(filterFile).filter((f): f is FileNode => f !== null)
  }, [files, searchQuery, activeFilter])

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  // Handle rename
  const handleRename = useCallback(
    (file: FileNode) => {
      if (newName && newName !== file.name && onFileRename) {
        onFileRename(file, newName)
      }
      setRenamingFile(null)
      setNewName('')
    },
    [newName, onFileRename]
  )

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, file: FileNode) => {
    e.preventDefault()
    setContextMenu({ file, x: e.clientX, y: e.clientY })
  }, [])

  // Render file tree recursively
  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.id)
      const isSelected = selectedFile === node.path
      const isRenaming = renamingFile === node.id

      if (node.type === 'folder') {
        return (
          <div key={node.id}>
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-zinc-700/50 rounded',
                isSelected && 'bg-zinc-700'
              )}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => toggleFolder(node.id)}
              onContextMenu={(e) => handleContextMenu(e, node)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              )}
              <FolderOpen className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-zinc-300 truncate">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div>{renderFileTree(node.children, depth + 1)}</div>
            )}
          </div>
        )
      }

      return (
        <div
          key={node.id}
          className={cn(
            'flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-zinc-700/50 rounded group',
            isSelected && 'bg-blue-500/20 text-blue-300'
          )}
          style={{ paddingLeft: `${depth * 12 + 24}px` }}
          onClick={() => onFileSelect(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {getFileIcon(node.name)}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => handleRename(node)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(node)
                if (e.key === 'Escape') {
                  setRenamingFile(null)
                  setNewName('')
                }
              }}
              className="flex-1 bg-zinc-700 text-sm px-1 rounded outline-none border border-blue-500"
              autoFocus
            />
          ) : (
            <span className="text-sm text-zinc-300 truncate flex-1">{node.name}</span>
          )}
          <button
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-600 rounded"
            onClick={(e) => {
              e.stopPropagation()
              handleContextMenu(e, node)
            }}
          >
            <MoreHorizontal className="h-3 w-3 text-zinc-400" />
          </button>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-full bg-zinc-800/50">
      {/* Search */}
      <div className="p-2 border-b border-zinc-700">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg pl-8 pr-8 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 p-2 border-b border-zinc-700 overflow-x-auto">
        <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
        {fileFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              'px-2 py-0.5 text-xs rounded-full whitespace-nowrap',
              activeFilter === filter.value
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-700 text-zinc-400 hover:text-white'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-1">
        {filteredFiles.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files found</p>
          </div>
        ) : (
          renderFileTree(filteredFiles)
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {onFileRename && (
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  setRenamingFile(contextMenu.file.id)
                  setNewName(contextMenu.file.name)
                  setContextMenu(null)
                }}
              >
                <Edit2 className="h-4 w-4" />
                Rename
              </button>
            )}
            {onFileCopy && (
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  onFileCopy(contextMenu.file)
                  setContextMenu(null)
                }}
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            )}
            {onFileDownload && (
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  onFileDownload(contextMenu.file)
                  setContextMenu(null)
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
            {onFileDelete && (
              <>
                <div className="border-t border-zinc-700 my-1" />
                <button
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-zinc-700"
                  onClick={() => {
                    onFileDelete(contextMenu.file)
                    setContextMenu(null)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default EnhancedFileExplorer
