import React from 'react'
import { FilePlus, FolderPlus } from '@geist-ui/icons'
import {
  File as FileIcon,
  Image as ImageIcon,
  Archive,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiJson,
  SiMarkdown,
  SiHtml5,
  SiCss3,
  SiSass,
  SiGo,
  SiRust,
  SiC,
  SiCplusplus,
  SiRuby,
  SiPhp,
  SiGnubash,
  SiYaml,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

interface FileTreeProps {
  project: Record<string, string>
  activeFile: string
  onSelect: (path: string) => void
  onCreateFile: (path: string) => void
  onCreateFolder: (folderPath: string) => void
  onRename: (oldPath: string, newPath: string) => void
  onDelete: (path: string) => void
  onMoveFile: (srcPath: string, destDir: string) => void
  onMoveFolder: (srcFolder: string, destDir: string) => void
  proposed?: Record<string, string> // proposed new or modified files (for badges)
  folders?: string[] // explicit folders to render (even if empty)
  onRenameFolder: (oldPath: string, newPath: string) => void
  onDeleteFolder: (path: string) => void
  // Controlled expansion (optional). If provided, component treats expansion as controlled.
  expandedPaths?: string[]
  onExpandedChange?: (next: string[]) => void
}

type TreeNode = {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

type ContextMenuState = {
  x: number
  y: number
  path: string
  type: 'file' | 'folder' | 'root'
} | null

const FILE_ICON_SIZE = 14
const FILE_ICON_COLOR = '#cfcfcf'
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp']
const ARCHIVE_EXTS = ['zip', 'tar', 'gz', 'tgz', 'rar', '7z']

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  js: SiJavascript,
  jsx: SiReact,
  ts: SiTypescript,
  tsx: SiReact,
  py: SiPython,
  json: SiJson,
  md: SiMarkdown,
  markdown: SiMarkdown,
  html: SiHtml5,
  htm: SiHtml5,
  css: SiCss3,
  scss: SiSass,
  sass: SiSass,
  java: FaJava,
  go: SiGo,
  rs: SiRust,
  c: SiC,
  h: SiC,
  cpp: SiCplusplus,
  cc: SiCplusplus,
  cxx: SiCplusplus,
  hpp: SiCplusplus,
  rb: SiRuby,
  php: SiPhp,
  sh: SiGnubash,
  bash: SiGnubash,
  zsh: SiGnubash,
  yml: SiYaml,
  yaml: SiYaml,
}

function renderFileIcon(path: string): React.ReactNode {
  const lastDot = path.lastIndexOf('.')
  const ext = (lastDot > -1 ? path.slice(lastDot + 1) : '').toLowerCase()
  if (ext && ICON_MAP[ext]) {
    const Icon = ICON_MAP[ext]
    return <Icon size={FILE_ICON_SIZE} color={FILE_ICON_COLOR} />
  }
  if (IMAGE_EXTS.includes(ext))
    return <ImageIcon size={FILE_ICON_SIZE} color={FILE_ICON_COLOR} />
  if (ARCHIVE_EXTS.includes(ext))
    return <Archive size={FILE_ICON_SIZE} color={FILE_ICON_COLOR} />
  return <FileIcon size={FILE_ICON_SIZE} color={FILE_ICON_COLOR} />
}

const sortNodes = (a: TreeNode, b: TreeNode) =>
  a.type === b.type
    ? a.name.localeCompare(b.name)
    : a.type === 'folder'
    ? -1
    : 1

function ensureFolder(cur: TreeNode, name: string, path: string): TreeNode {
  if (!cur.children) cur.children = []
  let child = cur.children.find((c) => c.name === name && c.type === 'folder')
  if (!child) {
    child = { name, path, type: 'folder', children: [] }
    cur.children.push(child)
  }
  return child
}

function buildTree(paths: string[], folders?: string[]): TreeNode {
  const root: TreeNode = { name: '', path: '', type: 'folder', children: [] }

  if (folders) {
    for (const f of folders.sort()) {
      const parts = f.split('/').filter(Boolean)
      let cur = root
      for (let i = 0; i < parts.length; i += 1) {
        const name = parts[i]
        const p = parts.slice(0, i + 1).join('/')
        cur = ensureFolder(cur, name, p)
      }
    }
  }

  for (const p of paths.sort()) {
    const parts = p.split('/')
    let cur = root
    for (let i = 0; i < parts.length; i += 1) {
      const isFile = i === parts.length - 1
      const name = parts[i]
      if (!cur.children) cur.children = []
      if (isFile) {
        const fileNode: TreeNode = {
          name,
          path: parts.slice(0, i + 1).join('/'),
          type: 'file',
        }
        if (!cur.children.find((c) => c.path === fileNode.path))
          cur.children.push(fileNode)
      } else {
        const folderPath = parts.slice(0, i + 1).join('/')
        cur = ensureFolder(cur, name, folderPath)
      }
    }
  }
  return root
}

export const FileTree: React.FC<FileTreeProps> = ({
  project,
  activeFile,
  onSelect,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onMoveFile,
  onMoveFolder,
  proposed,
  folders,
  onRenameFolder,
  onDeleteFolder,
  expandedPaths,
  onExpandedChange,
}) => {
  const [contextMenu, setContextMenu] = React.useState<ContextMenuState>(null)
  const [dragOver, setDragOver] = React.useState<string | 'root' | null>(null)
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [creating, setCreating] = React.useState<{
    type: 'file' | 'folder'
    parent: string
    name: string
  } | null>(null)
  const [renaming, setRenaming] = React.useState<{
    type: 'file' | 'folder'
    path: string
    name: string
  } | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const expandedSet = React.useMemo(
    () => (expandedPaths ? new Set(expandedPaths) : expanded),
    [expandedPaths, expanded]
  )
  const setExpandedInternal = React.useCallback(
    (updater: (prev: Set<string>) => Set<string>) => {
      if (onExpandedChange) {
        const next = updater(expandedSet)
        onExpandedChange(Array.from(next))
      } else {
        setExpanded((prev) => updater(prev))
      }
    },
    [onExpandedChange, expandedSet]
  )
  const treeRoot = React.useMemo(() => {
    const keys = new Set<string>(Object.keys(project))
    if (proposed) {
      for (const k of Object.keys(proposed)) keys.add(k)
    }
    const folderList: string[] = []
    for (const k of keys) {
      const parts = k.split('/')
      for (let i = 1; i < parts.length; i += 1)
        folderList.push(parts.slice(0, i).join('/'))
    }
    if (folders) folderList.push(...folders)
    const uniqFolders = Array.from(new Set(folderList.filter(Boolean)))
    return buildTree(Array.from(keys), uniqFolders)
  }, [project, proposed, folders])

  // Do not alter expansion on tree rebuild; only user actions modify expansion state.
  // We intentionally avoid syncing with treeRoot to prevent agent updates from toggling folders.

  const isExpanded = React.useCallback(
    (path: string) => expandedSet.has(path),
    [expandedSet]
  )
  const toggleExpanded = React.useCallback(
    (path: string) => {
      setExpandedInternal((prev) => {
        const next = new Set(prev)
        if (next.has(path)) next.delete(path)
        else next.add(path)
        return next
      })
    },
    [setExpandedInternal]
  )

  const creatingKey = React.useMemo(
    () => (creating ? `${creating.type}:${creating.parent}` : ''),
    [creating]
  )
  React.useEffect(() => {
    if (!creatingKey) return
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [creatingKey])

  const renamingKey = React.useMemo(
    () => (renaming ? `${renaming.type}:${renaming.path}` : ''),
    [renaming]
  )
  React.useEffect(() => {
    if (!renamingKey) return
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [renamingKey])

  const startCreate = React.useCallback(
    (type: 'file' | 'folder', parent: string) => {
      setCreating({ type, parent, name: '' })
      if (parent) {
        setExpandedInternal((prev) => {
          const next = new Set(prev)
          next.add(parent)
          return next
        })
      }
    },
    [setExpandedInternal]
  )

  const startRename = React.useCallback(
    (type: 'file' | 'folder', path: string) => {
      const parts = path.split('/')
      const name = parts[parts.length - 1] || ''
      setRenaming({ type, path, name })
    },
    []
  )

  const commitCreate = React.useCallback(() => {
    if (!creating) return
    const raw = creating.name.trim()
    if (!raw) {
      setCreating(null)
      return
    }
    const fullPath = (
      (creating.parent ? creating.parent.replace(/\/$/, '') + '/' : '') + raw
    ).replace(/^\//, '')
    if (creating.type === 'file') {
      const existing = new Set<string>(Object.keys(project))
      if (existing.has(fullPath)) {
        // Do not close; allow user to change name
        return
      }
      onCreateFile(fullPath)
    } else {
      const folderPath = fullPath.replace(/\/$/, '')
      onCreateFolder(folderPath)
    }
    setCreating(null)
  }, [creating, onCreateFile, onCreateFolder, project])

  const cancelCreate = React.useCallback(() => setCreating(null), [])

  const commitRename = React.useCallback(() => {
    if (!renaming) return
    const raw = renaming.name.trim()
    if (!raw) {
      setRenaming(null)
      return
    }
    const lastSlash = renaming.path.lastIndexOf('/')
    const parent = lastSlash > -1 ? renaming.path.slice(0, lastSlash) : ''
    const nextPath = (parent ? parent + '/' : '') + raw
    if (renaming.type === 'file') {
      if (nextPath !== renaming.path) onRename(renaming.path, nextPath)
    } else {
      const normalized = nextPath.replace(/^\//, '')
      if (normalized !== renaming.path) {
        onRenameFolder(renaming.path, normalized)
        setExpandedInternal((prev) => {
          const s = new Set(prev)
          if (s.has(renaming.path)) {
            s.delete(renaming.path)
            s.add(normalized)
          }
          return s
        })
      }
    }
    setRenaming(null)
  }, [renaming, onRename, onRenameFolder, setExpandedInternal])

  const cancelRename = React.useCallback(() => setRenaming(null), [])

  React.useEffect(() => {
    const close = () => setContextMenu(null)
    window.addEventListener('click', close)
    return () => {
      window.removeEventListener('click', close)
    }
  }, [])

  const openContextMenu = React.useCallback(
    (e: React.MouseEvent, path: string, type: 'file' | 'folder' | 'root') => {
      e.preventDefault()
      e.stopPropagation()
      setContextMenu({ x: e.clientX, y: e.clientY, path, type })
    },
    []
  )

  const onDragOverTarget = React.useCallback(
    (e: React.DragEvent, target: string | 'root') => {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'move'
      setDragOver(target)
    },
    []
  )

  const onDragLeaveAny = React.useCallback((e: React.DragEvent) => {
    e.stopPropagation()
    setDragOver(null)
  }, [])

  const onDropTo = React.useCallback(
    (e: React.DragEvent, destDir: string) => {
      e.preventDefault()
      e.stopPropagation()
      const folderSrc = e.dataTransfer.getData('text/folder')
      const fileSrc = e.dataTransfer.getData('text/plain')
      if (folderSrc) onMoveFolder(folderSrc, destDir)
      else if (fileSrc) onMoveFile(fileSrc, destDir)
      setDragOver(null)
    },
    [onMoveFile, onMoveFolder]
  )

  const renderNode = (node: TreeNode, depth = 0): React.ReactNode => {
    if (node.type === 'file') return renderFileRow(node, depth)
    return renderFolderNode(node, depth)
  }

  const renderFileRow = (node: TreeNode, depth: number): React.ReactNode => {
    const isProposed =
      proposed && Object.prototype.hasOwnProperty.call(proposed, node.path)
    const isActive = node.path === activeFile
    if (renaming && renaming.type === 'file' && renaming.path === node.path) {
      return (
        <div
          key={node.path}
          className={`px-2 py-1`}
          style={{ paddingLeft: 8 + depth * 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            className="w-full text-sm"
            style={{
              color: '#dddddd',
              backgroundColor: '#1f1f22',
              border: '1px solid #3e3e42',
              padding: '2px 4px',
            }}
            value={renaming.name}
            onChange={(e) =>
              setRenaming((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              else if (e.key === 'Escape') cancelRename()
            }}
            onBlur={commitRename}
          />
        </div>
      )
    }
    return (
      <div
        key={node.path}
        className={`px-2 py-1 text-sm flex items-center overflow-hidden`}
        style={{
          color: '#dddddd',
          paddingLeft: 8 + depth * 12,
          backgroundColor: isActive ? 'var(--vscode-selection)' : 'transparent',
        }}
        onClick={() => onSelect(node.path)}
        onContextMenu={(e) => openContextMenu(e, node.path, 'file')}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', node.path)
          e.dataTransfer.effectAllowed = 'move'
        }}
        onDragEnd={() => setDragOver(null)}
        title={node.path}
      >
        <span className="mr-2 flex items-center" aria-hidden="true">
          {renderFileIcon(node.path)}
        </span>
        <span className="truncate">{node.name}</span>
        {isProposed ? (
          <span className="ml-2 text-xs" style={{ color: '#80e080' }}>
            (proposed)
          </span>
        ) : null}
      </div>
    )
  }

  const renderFolderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const children = (node.children || []).sort(sortNodes)
    const childDepth = depth + (node.path ? 1 : 0)
    return (
      <div key={node.path || '/'}>
        {node.path &&
          (renaming &&
          renaming.type === 'folder' &&
          renaming.path === node.path ? (
            <div
              className="px-2 py-1"
              style={{ paddingLeft: 8 + depth * 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                className="w-full text-sm"
                style={{
                  color: '#dddddd',
                  backgroundColor: '#1f1f22',
                  border: '1px solid #3e3e42',
                  padding: '2px 4px',
                }}
                value={renaming.name}
                onChange={(e) =>
                  setRenaming((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename()
                  else if (e.key === 'Escape') cancelRename()
                }}
                onBlur={commitRename}
              />
            </div>
          ) : (
            <div
              className={`px-2 py-1 text-xs uppercase tracking-wide cursor-pointer flex items-center`}
              style={{
                color: 'var(--vscode-muted)',
                paddingLeft: 8 + depth * 12,
                backgroundColor:
                  dragOver === node.path
                    ? 'var(--vscode-hover)'
                    : 'transparent',
              }}
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(node.path)
              }}
              onContextMenu={(e) => openContextMenu(e, node.path, 'folder')}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/folder', node.path)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={(e) => onDragOverTarget(e, node.path)}
              onDragLeave={onDragLeaveAny}
              onDrop={(e) => onDropTo(e, node.path)}
              title={node.path}
            >
              {isExpanded(node.path) ? (
                <ChevronDown
                  size={12}
                  color="#a0a0a0"
                  className="mr-1"
                  aria-hidden="true"
                />
              ) : (
                <ChevronRight
                  size={12}
                  color="#a0a0a0"
                  className="mr-1"
                  aria-hidden="true"
                />
              )}
              <span>{node.name}</span>
            </div>
          ))}
        {(!node.path || isExpanded(node.path)) && (
          <>
            {creating && creating.parent === (node.path || '') && (
              <div
                className="px-2 py-1"
                style={{ paddingLeft: 8 + childDepth * 12 }}
              >
                <input
                  ref={inputRef}
                  className="w-full text-sm"
                  style={{
                    color: '#dddddd',
                    backgroundColor: '#1f1f22',
                    border: '1px solid #3e3e42',
                    padding: '2px 4px',
                  }}
                  placeholder={
                    creating.type === 'file' ? 'New file' : 'New folder'
                  }
                  value={creating.name}
                  onChange={(e) =>
                    setCreating((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitCreate()
                    else if (e.key === 'Escape') cancelCreate()
                  }}
                  onBlur={commitCreate}
                />
              </div>
            )}
            {children.map((child) => renderNode(child, childDepth))}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
      <div
        className={`px-3 flex items-center justify-between`}
        style={{
          backgroundColor: 'var(--vscode-panel)',
          borderBottom: '1px solid var(--vscode-panel-border)',
          height: 'var(--header-height)',
          ...(dragOver === 'root'
            ? { boxShadow: 'inset 0 0 0 9999px var(--vscode-hover)' }
            : {}),
        }}
        onContextMenu={(e) => openContextMenu(e, '', 'root')}
        onDragOver={(e) => onDragOverTarget(e, 'root')}
        onDragLeave={onDragLeaveAny}
        onDrop={(e) => onDropTo(e, '')}
      >
        <div className="text-sm" style={{ color: 'var(--vscode-text)' }}>
          Explorer
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded-sm"
            style={{ background: 'transparent' }}
            aria-label="New File"
            title="New File"
            onClick={() => startCreate('file', '')}
          >
            <FilePlus size={16} color="#cccccc" />
          </button>
          <button
            className="p-1 rounded-sm"
            style={{ background: 'transparent' }}
            aria-label="New Folder"
            title="New Folder"
            onClick={() => startCreate('folder', '')}
          >
            <FolderPlus size={16} color="#cccccc" />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 overflow-auto`}
        style={{
          padding: '6px 0',
          ...(dragOver === 'root'
            ? { boxShadow: 'inset 0 0 0 9999px var(--vscode-hover)' }
            : {}),
        }}
        onDragOver={(e) => onDragOverTarget(e, 'root')}
        onDragLeave={onDragLeaveAny}
        onDrop={(e) => onDropTo(e, '')}
        onContextMenu={(e) => openContextMenu(e, '', 'root')}
      >
        {renderNode(treeRoot)}
      </div>
      {contextMenu && (
        <div
          className="fixed z-50 rounded-sm shadow"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'var(--vscode-panel)',
            border: '1px solid var(--vscode-panel-border)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'file' && (
            <>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dddddd' }}
                onClick={() => {
                  startRename('file', contextMenu.path)
                  setContextMenu(null)
                }}
              >
                Rename
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dd6666' }}
                onClick={() => {
                  if (!confirm(`Delete ${contextMenu.path}?`)) return
                  onDelete(contextMenu.path)
                  setContextMenu(null)
                }}
              >
                Delete
              </button>
            </>
          )}
          {contextMenu.type === 'folder' && (
            <>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dddddd' }}
                onClick={() => {
                  startCreate('file', contextMenu.path)
                  setContextMenu(null)
                }}
              >
                New File
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dddddd' }}
                onClick={() => {
                  startCreate('folder', contextMenu.path)
                  setContextMenu(null)
                }}
              >
                New Folder
              </button>
              <div
                className="h-px"
                style={{ background: 'var(--vscode-panel-border)' }}
              />
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dddddd' }}
                onClick={() => {
                  startRename('folder', contextMenu.path)
                  setContextMenu(null)
                }}
              >
                Rename Folder
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dd6666' }}
                onClick={() => {
                  if (
                    !confirm(
                      `Delete folder ${contextMenu.path} and its contents?`
                    )
                  )
                    return
                  onDeleteFolder(contextMenu.path)
                  setContextMenu(null)
                }}
              >
                Delete Folder
              </button>
            </>
          )}
          {contextMenu.type === 'root' && (
            <>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dddddd' }}
                onClick={() => {
                  startCreate('file', '')
                  setContextMenu(null)
                }}
              >
                New File
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-sm"
                style={{ color: '#dddddd' }}
                onClick={() => {
                  startCreate('folder', '')
                  setContextMenu(null)
                }}
              >
                New Folder
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default FileTree
