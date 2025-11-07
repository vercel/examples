/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  TEMPLATES,
  FRONTEND_TEMPLATE_IDS,
  BACKEND_TEMPLATE_IDS,
} from '../templates'

// Template icon configuration - can be a single icon or array for stacked icons
// Each icon can be either a domain for favicon or 'icon:' prefix for regular icons
const TEMPLATE_ICONS: Record<string, string | string[]> = {
  blank: 'icon:📄', // Regular document icon
  fastapi: 'fastapi.tiangolo.com',
  express: 'expressjs.com',
  flask: 'flask.palletsprojects.com',
  hono: 'hono.dev',
  next: 'nextjs.org',
  next_stack: 'nextjs.org',
  react: 'react.dev',
  react_stack: 'react.dev',
  go: 'go.dev',
  rails: 'rubyonrails.org',
  react_fastapi: ['nextjs.org', 'fastapi.tiangolo.com'], // Stack both icons
}

const TemplateIcon: React.FC<{ templateId: string; size?: number }> = ({
  templateId,
  size = 16,
}) => {
  const iconConfig = TEMPLATE_ICONS[templateId]

  if (!iconConfig) {
    // Fallback to a generic code icon
    return (
      <span
        style={{
          fontSize: size,
          width: size,
          height: size,
          display: 'inline-block',
        }}
      >
        💻
      </span>
    )
  }

  // Helper to render a single icon
  const renderIcon = (icon: string) => {
    if (icon.startsWith('icon:')) {
      // Regular icon (emoji or unicode)
      const emoji = icon.substring(5)
      return (
        <span
          style={{
            fontSize: size,
            width: size,
            height: size,
            display: 'inline-block',
          }}
        >
          {emoji}
        </span>
      )
    }

    // Favicon from domain
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${icon}&sz=128`
    return (
      <img
        src={faviconUrl}
        alt=""
        style={{ width: size, height: size }}
        onError={(e) => {
          // If favicon fails to load, replace with a generic icon
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const span = document.createElement('span')
          span.textContent = '📦'
          span.style.fontSize = `${size}px`
          span.style.width = `${size}px`
          span.style.height = `${size}px`
          span.style.display = 'inline-block'
          target.parentNode?.replaceChild(span, target)
        }}
      />
    )
  }

  // Handle array of icons (side by side)
  if (Array.isArray(iconConfig)) {
    const iconSize = size * 0.75 // Make icons slightly smaller to fit together
    const gap = 2 // Small gap between icons

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: gap,
          width: 'fit-content',
          height: size,
        }}
      >
        {iconConfig.map((icon, index) => {
          if (icon.startsWith('icon:')) {
            const emoji = icon.substring(5)
            return (
              <span
                key={index}
                style={{
                  fontSize: iconSize,
                  width: iconSize,
                  height: iconSize,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {emoji}
              </span>
            )
          }

          return (
            <img
              key={index}
              src={`https://www.google.com/s2/favicons?domain=${icon}&sz=128`}
              alt=""
              style={{
                width: iconSize,
                height: iconSize,
                flexShrink: 0,
              }}
            />
          )
        })}
      </div>
    )
  }

  // Single icon
  return renderIcon(iconConfig)
}

type NewProjectModalProps = {
  visible: boolean
  defaultName: string
  existingNames: string[]
  onClose: () => void
  onCreate: (name: string, templateId: string) => void
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  visible,
  defaultName,
  existingNames,
  onClose,
  onCreate,
}) => {
  const [name, setName] = React.useState<string>('')
  const [mode, setMode] = React.useState<'template' | 'stack'>('template')
  const [templateId, setTemplateId] = React.useState<string>('fastapi')
  const [frontendId, setFrontendId] = React.useState<string>('next_stack')
  const [backendId, setBackendId] = React.useState<string>('fastapi')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (visible) {
      // Start with an empty value so the input shows only the placeholder suggestion
      setName('')
      setMode('template')
      setTemplateId('fastapi')
      setFrontendId('next_stack')
      setBackendId('fastapi')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [visible, defaultName])

  const placeholderName = React.useMemo(() => {
    const baseLabel = (() => {
      if (mode === 'template') {
        const tmpl = TEMPLATES.find((t) => t.id === templateId)
        return tmpl?.label
      }
      const fe = TEMPLATES.find((t) => t.id === frontendId)
      const be = TEMPLATES.find((t) => t.id === backendId)
      if (fe && be) return `${fe.label} + ${be.label}`
      return undefined
    })()
    const base = (baseLabel || defaultName || 'Project').trim()
    const existing = new Set(
      (existingNames || []).map((s) => (s || '').trim().toLowerCase())
    )
    if (!existing.has(base.toLowerCase())) return base
    // Find the next available suffix: base 2, base 3, ...
    // Stop at a reasonable upper bound to avoid infinite loops in pathological cases
    for (let i = 2; i < 1000; i += 1) {
      const candidate = `${base} ${i}`
      if (!existing.has(candidate.toLowerCase())) return candidate
    }
    // Fallback if all else fails
    return `${base} ${Date.now()}`
  }, [mode, templateId, frontendId, backendId, existingNames, defaultName])

  if (!visible) return null

  const handleSubmit = () => {
    const trimmed = (name || '').trim()
    const finalName = trimmed || placeholderName
    if (!finalName) return
    const id =
      mode === 'template' ? templateId : `stack:${frontendId}+${backendId}`
    onCreate(finalName, id)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 200000 }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.5)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded shadow-lg overflow-hidden"
        style={{
          background: 'var(--vscode-panel)',
          border: '1px solid var(--vscode-panel-border)',
        }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: '1px solid var(--vscode-panel-border)' }}
        >
          <div
            className="text-sm font-medium"
            style={{ color: 'var(--vscode-text)' }}
          >
            Create new project
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <label
            className="text-xs"
            htmlFor="new-project-name"
            style={{ color: 'var(--vscode-muted)' }}
          >
            Project name
          </label>
          <input
            id="new-project-name"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            placeholder={placeholderName || 'My Project'}
            className="w-full rounded-sm px-3 py-2"
            style={{
              background: 'var(--vscode-contrast)',
              border: '1px solid var(--vscode-panel-border)',
              color: 'var(--vscode-text)',
            }}
          />
          <div className="mt-2">
            <div className="flex gap-2 mb-2">
              <button
                className={`px-2 py-1 rounded-sm border cursor-pointer ${
                  mode === 'template' ? 'ring-1' : ''
                }`}
                style={{
                  background:
                    mode === 'template'
                      ? 'var(--vscode-surface)'
                      : 'var(--vscode-contrast)',
                  borderColor: 'var(--vscode-panel-border)',
                  color: 'var(--vscode-text)',
                }}
                onClick={() => setMode('template')}
              >
                Choose a Template
              </button>
              <button
                className={`px-2 py-1 rounded-sm border cursor-pointer ${
                  mode === 'stack' ? 'ring-1' : ''
                }`}
                style={{
                  background:
                    mode === 'stack'
                      ? 'var(--vscode-surface)'
                      : 'var(--vscode-contrast)',
                  borderColor: 'var(--vscode-panel-border)',
                  color: 'var(--vscode-text)',
                }}
                onClick={() => setMode('stack')}
              >
                Choose a Stack
              </button>
            </div>

            {mode === 'template' ? (
              <>
                <label
                  className="text-xs"
                  htmlFor="new-project-template"
                  style={{ color: 'var(--vscode-muted)' }}
                >
                  Choose a template
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {TEMPLATES.filter(
                    (t) =>
                      !(FRONTEND_TEMPLATE_IDS as readonly string[]).includes(
                        t.id
                      )
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`text-left p-2 rounded-sm border cursor-pointer ${
                        templateId === t.id ? 'ring-1' : ''
                      }`}
                      style={{
                        background:
                          templateId === t.id
                            ? 'var(--vscode-surface)'
                            : 'var(--vscode-contrast)',
                        borderColor: 'var(--vscode-panel-border)',
                        color: 'var(--vscode-text)',
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <TemplateIcon templateId={t.id} size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{t.label}</div>
                          {t.description ? (
                            <div
                              className="text-xs"
                              style={{ color: 'var(--vscode-muted)' }}
                            >
                              {t.description}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label
                  className="text-xs"
                  style={{ color: 'var(--vscode-muted)' }}
                >
                  Choose a frontend
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {TEMPLATES.filter((t) =>
                    (FRONTEND_TEMPLATE_IDS as readonly string[]).includes(t.id)
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFrontendId(t.id)}
                      className={`text-left p-2 rounded-sm border cursor-pointer ${
                        frontendId === t.id ? 'ring-1' : ''
                      }`}
                      style={{
                        background:
                          frontendId === t.id
                            ? 'var(--vscode-surface)'
                            : 'var(--vscode-contrast)',
                        borderColor: 'var(--vscode-panel-border)',
                        color: 'var(--vscode-text)',
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <TemplateIcon templateId={t.id} size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{t.label}</div>
                          {t.description ? (
                            <div
                              className="text-xs"
                              style={{ color: 'var(--vscode-muted)' }}
                            >
                              {t.description}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label
                    className="text-xs"
                    style={{ color: 'var(--vscode-muted)' }}
                  >
                    Choose a backend
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {TEMPLATES.filter((t) =>
                      (BACKEND_TEMPLATE_IDS as readonly string[]).includes(t.id)
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setBackendId(t.id)}
                        className={`text-left p-2 rounded-sm border cursor-pointer ${
                          backendId === t.id ? 'ring-1' : ''
                        }`}
                        style={{
                          background:
                            backendId === t.id
                              ? 'var(--vscode-surface)'
                              : 'var(--vscode-contrast)',
                          borderColor: 'var(--vscode-panel-border)',
                          color: 'var(--vscode-text)',
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <TemplateIcon templateId={t.id} size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{t.label}</div>
                            {t.description ? (
                              <div
                                className="text-xs"
                                style={{ color: 'var(--vscode-muted)' }}
                              >
                                {t.description}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            className="flex items-center justify-end gap-2 pt-2"
            style={{ borderTop: '1px solid var(--vscode-panel-border)' }}
          >
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-sm cursor-pointer"
              style={{
                background: 'var(--vscode-surface)',
                color: 'var(--vscode-text)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1 rounded-sm disabled:opacity-50 cursor-pointer"
              style={{ background: 'var(--vscode-accent)', color: '#ffffff' }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProjectModal
