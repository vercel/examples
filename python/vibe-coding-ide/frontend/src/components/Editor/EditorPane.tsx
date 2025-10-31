/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Editor, { DiffEditor, useMonaco } from '@monaco-editor/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type * as monaco from 'monaco-editor'
import { useProjects } from '../../context/ProjectsContext'
import { API_BASE } from '../../constants'
import { computeProjectHashes } from '../../lib/hash'
import { getUserId } from '../../lib/user'

type DiffEditorRef = monaco.editor.IStandaloneDiffEditor | null

interface EditorPaneProps {
  code: string
  setCode: (next: string) => void
  proposedContent: string | null
  onAcceptProposal: (newContent: string) => void
  onRejectProposal: () => void
  fileName?: string
  onStatusChange?: (status: {
    line: number
    column: number
    language: string
  }) => void
  // Triggered when user presses Cmd/Ctrl+K with a non-empty selection
  onRequestCodeFix?: (args: {
    fileName: string
    startLine: number
    endLine: number
    selectedCode: string
  }) => void
  // List of files with proposed changes (for navigation)
  proposedFiles?: string[]
  // Navigate to another proposed file
  onNavigateProposedFile?: (path: string) => void
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  code,
  setCode,
  proposedContent,
  onAcceptProposal,
  onRejectProposal,
  fileName = 'main.js',
  onStatusChange,
  onRequestCodeFix,
  proposedFiles,
  onNavigateProposedFile,
}) => {
  const diffEditorRef = React.useRef<DiffEditorRef>(null)
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const monacoInstance = useMonaco()
  const {
    sandboxStatus,
    project,
    proposals,
    activeProjectId,
    setLastEditorSync,
    setLastSandboxSeen,
    setAutoSyncing,
    hasSandboxBaseline,
    editorAheadPaths,
    isPathIgnored,
  } = useProjects() as unknown as {
    sandboxStatus: {
      editorAhead: number
      sandboxAhead: number
      diverged: number
    }
    project: Record<string, string>
    proposals: Record<string, string>
    activeProjectId: string
    setLastEditorSync: (s: {
      at: string
      fileHashes: Record<string, string>
    }) => void
    setLastSandboxSeen: (s: {
      at: string
      fileHashes: Record<string, string>
    }) => void
    setAutoSyncing: (v: boolean) => void
    hasSandboxBaseline: boolean
    editorAheadPaths: string[]
    isPathIgnored: (p: string) => boolean
  }
  const isOutOfSync =
    sandboxStatus.editorAhead +
      sandboxStatus.sandboxAhead +
      sandboxStatus.diverged >
    0

  const [syncing, setSyncing] = React.useState<boolean>(false)
  const lastSyncAtRef = React.useRef<number>(0)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const autoSyncBlockedUntilRef = React.useRef<number>(0)

  const handleImmediateSync = React.useCallback(async () => {
    if (syncing) return
    setSyncing(true)
    try {
      // Push merged editor + proposals (same as run payload) to live sandbox
      const merged: Record<string, string> = { ...project }
      for (const [p, c] of Object.entries(proposals || {}))
        merged[p] = c as string
      const userId: string = getUserId()
      const resp = await fetch(`${API_BASE}/play/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          project: merged,
          project_id: activeProjectId,
        }),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (resp.ok && data && data.ok) {
        // Mark sandbox as in-sync only on success
        const hashes = computeProjectHashes(merged, isPathIgnored)
        const now = new Date().toISOString()
        setLastEditorSync({ at: now, fileHashes: hashes })
        setLastSandboxSeen({ at: now, fileHashes: hashes })
      } else {
        // Optionally surface an error in console; UI remains unchanged
        console.warn('Sandbox sync failed:', data?.error || resp.statusText)
      }
    } catch {
      // noop
    } finally {
      setSyncing(false)
    }
  }, [
    project,
    proposals,
    activeProjectId,
    setLastEditorSync,
    setLastSandboxSeen,
    syncing,
    isPathIgnored,
  ])

  // Debounced auto-sync on edits
  React.useEffect(() => {
    // Preconditions: auth, baseline exists, only editor ahead, no diverge or sandbox ahead
    const shouldAuto =
      hasSandboxBaseline &&
      sandboxStatus.editorAhead > 0 &&
      sandboxStatus.diverged === 0 &&
      sandboxStatus.sandboxAhead === 0 &&
      Date.now() > (autoSyncBlockedUntilRef.current || 0)
    if (!shouldAuto) return

    // Throttle: at most once every 4s; Debounce: 1.2s trailing.
    // Schedule the timer to satisfy BOTH (i.e., the larger of debounce or remaining throttle).
    const now = Date.now()
    const since = now - (lastSyncAtRef.current || 0)
    const throttleRemaining = lastSyncAtRef.current
      ? Math.max(0, 4000 - since)
      : 0
    const delayMs = Math.max(1200, throttleRemaining)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(async () => {
      // Safety: recompute throttle check at fire time
      const elapsed = Date.now() - (lastSyncAtRef.current || 0)
      if (lastSyncAtRef.current && elapsed < 4000) return
      if (syncing) return
      try {
        setAutoSyncing(true)
        setSyncing(true)
        // Only send subset for changed files
        const changed =
          Array.isArray(editorAheadPaths) && editorAheadPaths.length > 0
            ? editorAheadPaths
            : Object.keys(project)
        const merged: Record<string, string> = {}
        for (const p of changed) {
          const v =
            proposals && proposals[p] !== undefined
              ? (proposals[p] as string)
              : (project[p] as string)
          if (v !== undefined) merged[p] = v as string
        }
        const userId: string = getUserId()
        const resp = await fetch(`${API_BASE}/play/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            project: merged,
            project_id: activeProjectId,
          }),
        })
        const data = await resp.json().catch(() => ({ ok: false }))
        if (resp.ok && data && data.ok) {
          lastSyncAtRef.current = Date.now()
          const hashes = computeProjectHashes(
            { ...project, ...(proposals || {}) },
            isPathIgnored
          )
          const nowISO = new Date().toISOString()
          setLastEditorSync({ at: nowISO, fileHashes: hashes })
          setLastSandboxSeen({ at: nowISO, fileHashes: hashes })
        } else if (
          resp.status === 404 ||
          (data && (data.detail || data.error))
        ) {
          const msg = String(data?.detail || data?.error || '').toLowerCase()
          if (resp.status === 404 || msg.includes('no sandboxes mapped')) {
            // Back off auto-sync attempts for a while to avoid loops when sandbox is gone/expired
            autoSyncBlockedUntilRef.current = Date.now() + 60_000 // 60s backoff
          }
        }
      } catch {
        // ignore
      } finally {
        setSyncing(false)
        setAutoSyncing(false)
      }
    }, delayMs)

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [
    project,
    proposals,
    sandboxStatus.editorAhead,
    sandboxStatus.diverged,
    sandboxStatus.sandboxAhead,
    hasSandboxBaseline,
    activeProjectId,
    setLastEditorSync,
    setLastSandboxSeen,
    setAutoSyncing,
    syncing,
    editorAheadPaths,
    isPathIgnored,
  ])

  // Create a Monaco theme that follows our CSS variables (Vercel dark)
  React.useEffect(() => {
    if (!monacoInstance) return
    const defineTheme = (m: typeof monacoInstance) => {
      const css = getComputedStyle(document.documentElement)
      const val = (name: string, fallback: string) =>
        css.getPropertyValue(name).trim() || fallback
      const bg = val('--vscode-bg', '#0a0a0a')
      const panel = val('--vscode-panel', '#0f0f0f')
      const border = val('--vscode-panel-border', '#1a1a1a')
      const text = val('--vscode-text', '#e6e6e6')
      const subtle = val('--vscode-subtle', '#8a8a8a')
      const selection = val('--vscode-selection', '#0b2a6b')
      const accent = val('--vscode-accent', '#0070f3')

      m.editor.defineTheme('vercel-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ token: '', foreground: text.replace('#', '') }],
        colors: {
          'editor.background': bg,
          'editor.foreground': text,
          'editorLineNumber.foreground': subtle,
          'editorLineNumber.activeForeground': text,
          'editorCursor.foreground': '#ffffff',
          'editor.selectionBackground': selection,
          'editor.inactiveSelectionBackground': selection + '80',
          'editor.lineHighlightBackground': '#ffffff08',
          'editorGutter.background': bg,
          'editorIndentGuide.background': '#222222',
          'editorIndentGuide.activeBackground': '#2a2a2a',
          'editorGroup.border': border,
          'editorWidget.background': panel,
          'editorWidget.border': border,
          'editorSuggestWidget.background': panel,
          'editorSuggestWidget.border': border,
          'editorSuggestWidget.foreground': text,
          'editorHoverWidget.background': panel,
          'editorHoverWidget.border': border,
          'editorBracketMatch.background': accent + '33',
          'editorBracketMatch.border': accent,
          'scrollbarSlider.background': '#262626',
          'scrollbarSlider.hoverBackground': '#2f2f2f',
          'scrollbarSlider.activeBackground': '#2f2f2f',
        },
      })
    }
    defineTheme(monacoInstance)
    monacoInstance.editor.setTheme('vercel-dark')
  }, [monacoInstance])

  const language = React.useMemo(() => {
    const name = (fileName || '').toLowerCase()
    const getExt = () => {
      if (name.endsWith('.d.ts')) return 'ts'
      const idx = name.lastIndexOf('.')
      return idx >= 0 ? name.slice(idx + 1) : ''
    }
    const ext = getExt()
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'json':
        return 'json'
      case 'css':
        return 'css'
      case 'html':
      case 'htm':
        return 'html'
      case 'md':
      case 'markdown':
        return 'markdown'
      case 'py':
        return 'python'
      case 'go':
        return 'go'
      case 'rs':
        return 'rust'
      case 'java':
        return 'java'
      case 'rb':
        return 'ruby'
      case 'php':
        return 'php'
      case 'sh':
      case 'bash':
        return 'shell'
      case 'yaml':
      case 'yml':
        return 'yaml'
      case 'toml':
        return 'toml'
      case 'c':
        return 'c'
      case 'cpp':
      case 'cc':
      case 'cxx':
      case 'hpp':
      case 'hh':
        return 'cpp'
      case 'cs':
        return 'csharp'
      case 'kt':
      case 'kts':
        return 'kotlin'
      case 'swift':
        return 'swift'
      case 'sql':
        return 'sql'
      case 'txt':
        return 'plaintext'
      default:
        return 'plaintext'
    }
  }, [fileName])

  // Image handling
  const fileExtension = React.useMemo(() => {
    const name = (fileName || '').toLowerCase()
    const idx = name.lastIndexOf('.')
    return idx >= 0 ? name.slice(idx + 1) : ''
  }, [fileName])

  const isImage = React.useMemo(() => {
    return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'].includes(
      fileExtension
    )
  }, [fileExtension])

  const mimeFromExt = React.useCallback((ext: string) => {
    switch (ext) {
      case 'png':
        return 'image/png'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'gif':
        return 'image/gif'
      case 'svg':
        return 'image/svg+xml'
      case 'webp':
        return 'image/webp'
      case 'bmp':
        return 'image/bmp'
      default:
        return 'application/octet-stream'
    }
  }, [])

  const buildImageSrc = React.useCallback(
    (content: string | null | undefined) => {
      if (!isImage) return null
      const txt = (content || '').trim()
      if (!txt) return null
      // If already a data URL, use as-is
      if (/^data:image\//i.test(txt)) return txt
      // If looks like a URL (http(s), blob, or absolute /assets path), use directly
      if (/^(https?:|blob:|\/)/i.test(txt)) return txt
      // SVG markup
      if (fileExtension === 'svg' || /^<svg[\s\S]*<\/svg>$/i.test(txt)) {
        try {
          return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(txt)}`
        } catch {
          // fallthrough
        }
      }
      const mime = mimeFromExt(fileExtension)
      // Heuristic: if it looks like base64, wrap it
      const compact = txt.replace(/\s+/g, '')
      if (
        /^[A-Za-z0-9+/=]+$/.test(compact) &&
        compact.length % 4 === 0 &&
        compact.length > 64
      ) {
        return `data:${mime};base64,${compact}`
      }
      // Fallback: treat the string as binary data and create a Blob URL
      try {
        const buf = new Uint8Array(txt.length)
        for (let i = 0; i < txt.length; i += 1)
          buf[i] = txt.charCodeAt(i) & 0xff
        const blob = new Blob([buf], { type: mime })
        return URL.createObjectURL(blob)
      } catch {
        return null
      }
    },
    [isImage, fileExtension, mimeFromExt]
  )

  const imageSrc = React.useMemo(
    () => buildImageSrc(code),
    [buildImageSrc, code]
  )
  const proposedImageSrc = React.useMemo(
    () => buildImageSrc(proposedContent),
    [buildImageSrc, proposedContent]
  )

  // Revoke blob URLs on change/unmount
  React.useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:'))
        URL.revokeObjectURL(imageSrc)
      if (proposedImageSrc && proposedImageSrc.startsWith('blob:'))
        URL.revokeObjectURL(proposedImageSrc)
    }
  }, [imageSrc, proposedImageSrc])

  // Notify status when language changes
  React.useEffect(() => {
    const editor = editorRef.current
    const pos = editor?.getPosition()
    if (onStatusChange) {
      onStatusChange({
        line: pos?.lineNumber || 1,
        column: pos?.column || 1,
        language,
      })
    }
  }, [language, onStatusChange])

  // Proposed-files navigation derivations
  const proposedList = React.useMemo(
    () => (Array.isArray(proposedFiles) ? proposedFiles : []),
    [proposedFiles]
  )
  const currentIndex = React.useMemo(
    () => proposedList.indexOf(fileName || ''),
    [proposedList, fileName]
  )
  const totalProposed = proposedList.length
  const hasProposals = totalProposed > 0
  const prevIndex =
    currentIndex >= 0
      ? Math.max(currentIndex - 1, 0)
      : Math.max(totalProposed - 1, 0)
  const nextIndex =
    currentIndex >= 0
      ? Math.min(currentIndex + 1, Math.max(totalProposed - 1, 0))
      : 0
  const goPrev = React.useCallback(() => {
    if (!hasProposals || !onNavigateProposedFile) return
    onNavigateProposedFile(proposedList[prevIndex])
  }, [hasProposals, onNavigateProposedFile, proposedList, prevIndex])
  const goNext = React.useCallback(() => {
    if (!hasProposals || !onNavigateProposedFile) return
    onNavigateProposedFile(proposedList[nextIndex])
  }, [hasProposals, onNavigateProposedFile, proposedList, nextIndex])

  return (
    <div className="flex-1 flex flex-col" style={{ width: '100%' }}>
      <div
        className="px-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--vscode-panel)',
          borderBottom: '1px solid var(--vscode-panel-border)',
          height: 'var(--header-height)',
        }}
      >
        <div
          className="text-sm font-medium m-0"
          style={{ color: 'var(--vscode-text)' }}
        >
          {fileName}
        </div>
        {/* {isOutOfSync && (
          <button
            onClick={handleImmediateSync}
            className="px-2 py-1 rounded-sm text-xs cursor-pointer"
            style={{ background: syncing ? 'var(--vscode-surface)' : 'var(--vscode-accent)', color: syncing ? 'var(--vscode-text)' : '#ffffff', border: '1px solid var(--vscode-panel-border)' }}
            disabled={syncing}
            title={'Push editor changes to the running sandbox now'}
          >
            {syncing ? 'Syncing…' : 'Sync sandbox'}
          </button>
        )} */}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {isImage ? (
          proposedContent === null ? (
            <div
              className="h-full w-full flex items-center justify-center overflow-auto"
              style={{ backgroundColor: 'var(--vscode-bg)' }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={fileName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <div
                  className="text-sm"
                  style={{ color: 'var(--vscode-subtle)' }}
                >
                  No preview available
                </div>
              )}
            </div>
          ) : (
            <div
              className="h-full w-full flex items-stretch gap-2 p-2 overflow-auto"
              style={{ backgroundColor: 'var(--vscode-bg)' }}
            >
              <div
                className="flex-1 min-w-0 flex flex-col items-center justify-center"
                style={{ border: '1px solid var(--vscode-panel-border)' }}
              >
                <div
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: 'var(--vscode-muted)' }}
                >
                  Current
                </div>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={`${fileName} (current)`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div
                    className="text-sm"
                    style={{ color: 'var(--vscode-subtle)' }}
                  >
                    No current preview
                  </div>
                )}
              </div>
              <div
                className="flex-1 min-w-0 flex flex-col items-center justify-center"
                style={{ border: '1px solid var(--vscode-panel-border)' }}
              >
                <div
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: 'var(--vscode-muted)' }}
                >
                  Proposed
                </div>
                {proposedImageSrc ? (
                  <img
                    src={proposedImageSrc}
                    alt={`${fileName} (proposed)`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div
                    className="text-sm"
                    style={{ color: 'var(--vscode-subtle)' }}
                  >
                    No proposed preview
                  </div>
                )}
              </div>
            </div>
          )
        ) : proposedContent === null ? (
          <Editor
            key={fileName}
            height="100%"
            path={`file:///${fileName}`}
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vercel-dark"
            beforeMount={(m) => {
              // Ensure theme exists before mounting to avoid white theme flashes
              const css = getComputedStyle(document.documentElement)
              const val = (name: string, fallback: string) =>
                css.getPropertyValue(name).trim() || fallback
              const bg = val('--vscode-bg', '#0a0a0a')
              const panel = val('--vscode-panel', '#0f0f0f')
              const border = val('--vscode-panel-border', '#1a1a1a')
              const text = val('--vscode-text', '#e6e6e6')
              const subtle = val('--vscode-subtle', '#8a8a8a')
              const selection = val('--vscode-selection', '#0b2a6b')
              const accent = val('--vscode-accent', '#0070f3')
              m.editor.defineTheme('vercel-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [{ token: '', foreground: text.replace('#', '') }],
                colors: {
                  'editor.background': bg,
                  'editor.foreground': text,
                  'editorLineNumber.foreground': subtle,
                  'editorLineNumber.activeForeground': text,
                  'editorCursor.foreground': '#ffffff',
                  'editor.selectionBackground': selection,
                  'editor.inactiveSelectionBackground': selection + '80',
                  'editor.lineHighlightBackground': '#ffffff08',
                  'editorGutter.background': bg,
                  'editorIndentGuide.background': '#222222',
                  'editorIndentGuide.activeBackground': '#2a2a2a',
                  'editorGroup.border': border,
                  'editorWidget.background': panel,
                  'editorWidget.border': border,
                  'editorSuggestWidget.background': panel,
                  'editorSuggestWidget.border': border,
                  'editorSuggestWidget.foreground': text,
                  'editorHoverWidget.background': panel,
                  'editorHoverWidget.border': border,
                  'editorBracketMatch.background': accent + '33',
                  'editorBracketMatch.border': accent,
                  'scrollbarSlider.background': '#262626',
                  'scrollbarSlider.hoverBackground': '#2f2f2f',
                  'scrollbarSlider.activeBackground': '#2f2f2f',
                },
              })

              // Configure TypeScript/JavaScript for TSX/JSX awareness
              try {
                const ts = m.languages.typescript
                ts.typescriptDefaults.setCompilerOptions({
                  allowJs: true,
                  allowNonTsExtensions: true,
                  jsx: ts.JsxEmit.ReactJSX,
                  jsxFactory: 'React.createElement',
                  jsxFragmentFactory: 'React.Fragment',
                  target: ts.ScriptTarget.ES2020,
                  module: ts.ModuleKind.ESNext,
                  moduleResolution: ts.ModuleResolutionKind.NodeJs,
                  lib: ['es2022', 'dom'],
                  skipLibCheck: true,
                  noEmit: true,
                  esModuleInterop: true,
                  isolatedModules: true,
                })
                ts.typescriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: false,
                })
                ts.javascriptDefaults.setCompilerOptions({
                  allowJs: true,
                  allowNonTsExtensions: true,
                  // Help JSX in .jsx files
                  jsx: ts.JsxEmit.ReactJSX,
                  jsxFactory: 'React.createElement',
                  jsxFragmentFactory: 'React.Fragment',
                  target: ts.ScriptTarget.ES2020,
                  lib: ['es2022', 'dom'],
                })
                ts.javascriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: false,
                })
                ts.typescriptDefaults.setEagerModelSync(true)
                ts.javascriptDefaults.setEagerModelSync(true)
              } catch {
                // noop
              }
            }}
            onMount={(editorInstance) => {
              editorRef.current =
                editorInstance as unknown as monaco.editor.IStandaloneCodeEditor
              const update = () => {
                const pos = editorInstance.getPosition()
                if (pos && onStatusChange)
                  onStatusChange({
                    line: pos.lineNumber,
                    column: pos.column,
                    language,
                  })
              }
              update()
              editorInstance.onDidChangeCursorPosition(update)
              editorInstance.onDidFocusEditorText(update)
              // Register Cmd/Ctrl+K to open Code Fix modal for current selection
              try {
                const ed =
                  editorInstance as unknown as monaco.editor.IStandaloneCodeEditor
                const keybinding = monacoInstance
                  ? [
                      monacoInstance.KeyMod.CtrlCmd |
                        monacoInstance.KeyCode.KeyK,
                    ]
                  : undefined
                ed.addAction({
                  id: 'codefix.open',
                  label: 'Fix selected code (AI)',
                  keybindings: keybinding as number[] | undefined,
                  precondition: 'textInputFocus',
                  run: (codeEditor: monaco.editor.ICodeEditor) => {
                    const model = codeEditor.getModel()
                    const sel = codeEditor.getSelection()
                    if (!model || !sel) return
                    const text = model.getValueInRange(sel)
                    if (!text || !String(text).trim()) return
                    const startLine = sel.startLineNumber
                    const endLine = sel.endLineNumber
                    onRequestCodeFix?.({
                      fileName,
                      startLine,
                      endLine,
                      selectedCode: String(text),
                    })
                  },
                })
              } catch {
                // noop
              }
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        ) : (
          <DiffEditor
            key={`diff:${fileName}`}
            keepCurrentOriginalModel={true}
            keepCurrentModifiedModel={true}
            height="100%"
            originalModelPath={`file:///${fileName}.orig`}
            modifiedModelPath={`file:///${fileName}`}
            original={code}
            modified={proposedContent || code}
            language={language}
            theme="vercel-dark"
            beforeMount={(m) => {
              const css = getComputedStyle(document.documentElement)
              const val = (name: string, fallback: string) =>
                css.getPropertyValue(name).trim() || fallback
              const bg = val('--vscode-bg', '#0a0a0a')
              const panel = val('--vscode-panel', '#0f0f0f')
              const border = val('--vscode-panel-border', '#1a1a1a')
              const text = val('--vscode-text', '#e6e6e6')
              const subtle = val('--vscode-subtle', '#8a8a8a')
              const selection = val('--vscode-selection', '#0b2a6b')
              const accent = val('--vscode-accent', '#0070f3')
              m.editor.defineTheme('vercel-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [{ token: '', foreground: text.replace('#', '') }],
                colors: {
                  'editor.background': bg,
                  'editor.foreground': text,
                  'editorLineNumber.foreground': subtle,
                  'editorLineNumber.activeForeground': text,
                  'editorCursor.foreground': '#ffffff',
                  'editor.selectionBackground': selection,
                  'editor.inactiveSelectionBackground': selection + '80',
                  'editor.lineHighlightBackground': '#ffffff08',
                  'editorGutter.background': bg,
                  'editorIndentGuide.background': '#222222',
                  'editorIndentGuide.activeBackground': '#2a2a2a',
                  'editorGroup.border': border,
                  'editorWidget.background': panel,
                  'editorWidget.border': border,
                  'editorSuggestWidget.background': panel,
                  'editorSuggestWidget.border': border,
                  'editorSuggestWidget.foreground': text,
                  'editorHoverWidget.background': panel,
                  'editorHoverWidget.border': border,
                  'editorBracketMatch.background': accent + '33',
                  'editorBracketMatch.border': accent,
                  'scrollbarSlider.background': '#262626',
                  'scrollbarSlider.hoverBackground': '#2f2f2f',
                  'scrollbarSlider.activeBackground': '#2f2f2f',
                },
              })

              // Configure TypeScript/JavaScript for TSX/JSX awareness
              try {
                const ts = m.languages.typescript
                ts.typescriptDefaults.setCompilerOptions({
                  allowJs: true,
                  allowNonTsExtensions: true,
                  jsx: ts.JsxEmit.ReactJSX,
                  jsxFactory: 'React.createElement',
                  jsxFragmentFactory: 'React.Fragment',
                  target: ts.ScriptTarget.ES2020,
                  module: ts.ModuleKind.ESNext,
                  moduleResolution: ts.ModuleResolutionKind.NodeJs,
                  lib: ['es2022', 'dom'],
                  skipLibCheck: true,
                  noEmit: true,
                  esModuleInterop: true,
                  isolatedModules: true,
                })
                ts.typescriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: false,
                })
                ts.javascriptDefaults.setCompilerOptions({
                  allowJs: true,
                  allowNonTsExtensions: true,
                  jsx: ts.JsxEmit.ReactJSX,
                  jsxFactory: 'React.createElement',
                  jsxFragmentFactory: 'React.Fragment',
                  target: ts.ScriptTarget.ES2020,
                  lib: ['es2022', 'dom'],
                })
                ts.javascriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: false,
                })
                ts.typescriptDefaults.setEagerModelSync(true)
                ts.javascriptDefaults.setEagerModelSync(true)
              } catch {
                // noop
              }
            }}
            onMount={(editor) => {
              diffEditorRef.current =
                editor as unknown as monaco.editor.IStandaloneDiffEditor
              const originalEditor =
                diffEditorRef.current?.getOriginalEditor?.()
              const modifiedEditor =
                diffEditorRef.current?.getModifiedEditor?.()
              originalEditor?.updateOptions?.({ fontSize: 14 })
              modifiedEditor?.updateOptions?.({ fontSize: 14 })
              modifiedEditor?.layout?.()
              if (modifiedEditor) {
                const update = () => {
                  const pos = modifiedEditor.getPosition()
                  if (pos && onStatusChange)
                    onStatusChange({
                      line: pos.lineNumber,
                      column: pos.column,
                      language,
                    })
                }
                update()
                modifiedEditor.onDidChangeCursorPosition(update)
                modifiedEditor.onDidFocusEditorText(update)
              }
            }}
            options={{
              renderSideBySide: false,
              readOnly: false,
              originalEditable: false,
              renderMarginRevertIcon: true,
              lineNumbers: 'on',
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        )}

        {proposedContent !== null && (
          <div
            className="absolute flex items-center gap-2 rounded shadow-lg"
            style={{
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--vscode-panel)',
              border: '1px solid var(--vscode-panel-border)',
              padding: '6px 10px',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => onRejectProposal()}
              className="px-2 py-1 rounded-sm cursor-pointer text-sm"
              style={{ background: 'var(--vscode-danger)', color: '#ffffff' }}
              title="Reject all proposed changes"
            >
              Reject all
            </button>
            <button
              onClick={() => {
                if (diffEditorRef.current) {
                  const updatedCode = diffEditorRef.current
                    .getModifiedEditor()
                    .getValue()
                  onAcceptProposal(updatedCode)
                } else if (proposedContent !== null) {
                  onAcceptProposal(proposedContent)
                }
              }}
              className="px-2 py-1 rounded-sm cursor-pointer text-sm"
              style={{ background: 'var(--vscode-success)', color: '#ffffff' }}
              title="Accept all proposed changes"
            >
              Accept all
            </button>
          </div>
        )}

        {totalProposed > 0 && (
          <div
            className="absolute flex items-center gap-2 rounded shadow-lg"
            style={{
              bottom: 12,
              right: 12,
              backgroundColor: 'var(--vscode-panel)',
              border: '1px solid var(--vscode-panel-border)',
              padding: '6px 10px',
              zIndex: 10,
            }}
            aria-label="Navigate files with proposed changes"
          >
            <button
              onClick={goPrev}
              disabled={!hasProposals}
              className="px-2 py-1 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center"
              title="Previous file with proposed changes"
              aria-label="Previous file with proposed changes"
              style={{
                background: 'var(--vscode-surface)',
                color: 'var(--vscode-text)',
                border: '1px solid var(--vscode-panel-border)',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs" style={{ color: 'var(--vscode-text)' }}>
              {currentIndex >= 0 ? currentIndex + 1 : 1} / {totalProposed} files
            </div>
            <button
              onClick={goNext}
              disabled={!hasProposals}
              className="px-2 py-1 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center"
              title="Next file with proposed changes"
              aria-label="Next file with proposed changes"
              style={{
                background: 'var(--vscode-surface)',
                color: 'var(--vscode-text)',
                border: '1px solid var(--vscode-panel-border)',
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
