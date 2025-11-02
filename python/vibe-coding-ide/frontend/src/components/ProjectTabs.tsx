import React from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Download,
  MoreVertical,
  Copy,
} from 'lucide-react'

export type ProjectTab = {
  id: string
  name: string
}

type ProjectTabsProps = {
  projects: ProjectTab[]
  activeProjectId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onDownload: () => void
  onClone: (id: string) => void
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projects,
  activeProjectId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onDownload,
  onClone,
}) => {
  const [renamingId, setRenamingId] = React.useState<string | null>(null)
  const [renameValue, setRenameValue] = React.useState<string>('')
  const renameInputRef = React.useRef<HTMLInputElement>(null)
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null)
  const [menuRect, setMenuRect] = React.useState<DOMRect | null>(null)

  React.useEffect(() => {
    if (renamingId) {
      requestAnimationFrame(() => renameInputRef.current?.focus())
    }
  }, [renamingId])

  React.useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!openMenuId) return
      // If click happens while a portal overlay is open, allow overlay handlers to manage it
      const target = e.target as HTMLElement | null
      if (target && target.closest('[data-project-menu-portal="true"]')) return
      setOpenMenuId(null)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [openMenuId])

  React.useEffect(() => {
    const onScrollOrResize = () => {
      if (!openMenuId) return
      // Close on scroll/resize to avoid stale positioning
      setOpenMenuId(null)
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [openMenuId])

  const commitRename = (id: string) => {
    const trimmed = (renameValue || '').trim()
    if (!trimmed) return
    onRename(id, trimmed)
    setRenamingId(null)
    setRenameValue('')
  }

  const cancelRename = () => {
    setRenamingId(null)
    setRenameValue('')
  }

  return (
    <div
      className="hidden md:flex items-stretch justify-between select-none w-full"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--vscode-panel)',
        borderBottom: '1px solid var(--vscode-panel-border)',
      }}
      role="tablist"
      aria-label="Projects"
    >
      <div className="flex-1 overflow-hidden">
        <div className="flex items-stretch h-full overflow-x-auto">
          {projects.map((p) => {
            const active = p.id === activeProjectId
            return (
              <div
                key={p.id}
                className="flex h-full"
                style={{
                  borderRight: '1px solid var(--vscode-panel-border)',
                  boxShadow: active
                    ? 'inset 0 -2px 0 var(--vscode-accent)'
                    : 'none',
                }}
              >
                {renamingId === p.id ? (
                  <div className="px-3 h-full inline-flex items-center gap-2">
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename(p.id)
                        if (e.key === 'Escape') cancelRename()
                      }}
                      className="text-sm px-2 py-1 rounded-sm"
                      style={{
                        background: 'var(--vscode-contrast)',
                        border: '1px solid var(--vscode-panel-border)',
                        color: 'var(--vscode-text)',
                      }}
                      aria-label="Project name"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onSelect(p.id)}
                    className="px-3 h-full inline-flex items-center gap-2 text-sm"
                    title={p.name}
                    style={{
                      color: 'var(--vscode-text)',
                      background: 'transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span className="truncate max-w-[16rem]">{p.name}</span>
                  </button>
                )}
                {active && (
                  <div
                    className="flex items-center gap-1 px-2 relative"
                    aria-label="Project actions"
                    data-project-menu={p.id}
                  >
                    {renamingId === p.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => commitRename(p.id)}
                          disabled={!renameValue.trim()}
                          className="p-1 rounded hover:bg-white/5 disabled:opacity-50"
                          title="Save name"
                          aria-label="Save name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          className="p-1 rounded hover:bg-white/5"
                          title="Cancel rename"
                          aria-label="Cancel rename"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            const rect = (
                              e.currentTarget as HTMLElement
                            ).getBoundingClientRect()
                            setMenuRect(rect)
                            setOpenMenuId(openMenuId === p.id ? null : p.id)
                          }}
                          className="p-1 rounded hover:bg-white/5"
                          title="Project options"
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === p.id}
                          aria-label="Project options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {/* Portal overlay menu rendered below */}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="pr-2 flex items-center h-full">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded cursor-pointer"
          style={{
            background: 'var(--vscode-surface)',
            color: 'var(--vscode-text)',
            border: '1px solid var(--vscode-panel-border)',
          }}
          title="New project"
          aria-label="New project"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>
      {openMenuId &&
        menuRect &&
        createPortal(
          (() => {
            const MENU_WIDTH = 200
            const left = Math.min(
              Math.max(8, menuRect.right - MENU_WIDTH),
              window.innerWidth - MENU_WIDTH - 8
            )
            const top = Math.min(
              menuRect.bottom + 6,
              window.innerHeight - 8 - 200
            )
            return (
              <div
                data-project-menu-portal="true"
                className="fixed inset-0 z-50"
                onMouseDown={() => setOpenMenuId(null)}
              >
                <div
                  role="menu"
                  className="absolute rounded text-sm min-w-[200px]"
                  style={{
                    left,
                    top,
                    background: 'var(--vscode-surface)',
                    border: '1px solid var(--vscode-panel-border)',
                    color: 'var(--vscode-text)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const p = projects.find((pp) => pp.id === openMenuId)
                    if (!p) return null
                    return (
                      <>
                        <button
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            setRenamingId(p.id)
                            setRenameValue(p.name)
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5"
                          aria-label="Rename project"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Rename</span>
                        </button>
                        <button
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            onClone(p.id)
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5"
                          aria-label="Clone project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Clone</span>
                        </button>
                        <button
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            onDownload()
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5"
                          aria-label="Download ZIP"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download ZIP</span>
                        </button>
                        <div
                          className="h-px my-1"
                          style={{ background: 'var(--vscode-panel-border)' }}
                        />
                        <button
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            onDelete(p.id)
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5"
                          aria-label="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </>
                    )
                  })()}
                </div>
              </div>
            )
          })(),
          document.body
        )}
    </div>
  )
}

export default ProjectTabs
