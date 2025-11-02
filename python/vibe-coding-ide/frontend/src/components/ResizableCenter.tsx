import React from 'react'
import { EditorPane } from './Editor/EditorPane'
import { TerminalPane } from './Editor/TerminalPane'
import StatusBar from './Editor/StatusBar'

type ResizableCenterProps = {
  code: string
  setCode: (v: string) => void
  proposals: Record<string, string>
  clearProposal: (file: string) => void
  activeFile: string
  onSelectFile: (path: string) => void
  terminalLogs: string
  onClearLogs: () => void
  onRequestCodeFix?: (args: {
    fileName: string
    startLine: number
    endLine: number
    selectedCode: string
  }) => void
  isIgnored?: (path: string) => boolean
}

const ResizableCenter: React.FC<ResizableCenterProps> = ({
  code,
  setCode,
  proposals,
  clearProposal,
  activeFile,
  onSelectFile,
  terminalLogs,
  onClearLogs,
  onRequestCodeFix,
  isIgnored,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [terminalHeight, setTerminalHeight] = React.useState<number>(200)
  const [resizing, setResizing] = React.useState<boolean>(false)
  const [status, setStatus] = React.useState<{
    line: number
    column: number
    language: string
  }>({ line: 1, column: 1, language: 'plaintext' })

  const minTerminalHeight = 120
  const minEditorHeight = 120

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    setResizing(true)
    e.preventDefault()
  }, [])

  const onMouseMove = React.useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const availableHeight = rect.height
    const proposed = rect.bottom - e.clientY
    const maxTerminal = Math.max(
      minTerminalHeight,
      availableHeight - minEditorHeight
    )
    const clamped = Math.min(Math.max(proposed, minTerminalHeight), maxTerminal)
    setTerminalHeight(clamped)
  }, [])

  const onMouseUp = React.useCallback(() => {
    setResizing(false)
  }, [])

  React.useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'row-resize'
      document.body.style.userSelect = 'none'
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [resizing, onMouseMove, onMouseUp])

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 min-h-0 flex flex-col">
        <EditorPane
          code={code}
          setCode={(v) => setCode(v)}
          proposedContent={
            isIgnored && isIgnored(activeFile)
              ? null
              : proposals[activeFile] ?? null
          }
          onAcceptProposal={(newContent) => {
            setCode(newContent)
            clearProposal(activeFile)
          }}
          onRejectProposal={() => clearProposal(activeFile)}
          fileName={activeFile}
          onStatusChange={setStatus}
          onRequestCodeFix={onRequestCodeFix}
          proposedFiles={React.useMemo(() => {
            const list: string[] = []
            for (const k of Object.keys(proposals)) {
              if (!isIgnored || !isIgnored(k)) list.push(k)
            }
            // Ensure the current file is included if it has a proposal but is ignored by filters
            if (
              proposals[activeFile] !== undefined &&
              !list.includes(activeFile)
            )
              list.push(activeFile)
            return list.sort((a, b) => a.localeCompare(b))
          }, [proposals, isIgnored, activeFile])}
          onNavigateProposedFile={(path) =>
            onSelectFile((path || '').replace(/^\//, ''))
          }
        />
      </div>
      {terminalLogs && terminalLogs.length > 0 ? (
        <>
          <div
            onMouseDown={onMouseDown}
            className={`h-1 cursor-row-resize transition-colors`}
            style={{
              backgroundColor: resizing
                ? 'var(--vscode-accent)'
                : 'var(--vscode-panel-border)',
              position: 'relative',
              zIndex: 99999,
            }}
          />
          <TerminalPane
            height={terminalHeight}
            logs={terminalLogs}
            onClear={onClearLogs}
          />
        </>
      ) : null}
      <StatusBar
        line={status.line}
        column={status.column}
        language={status.language}
      />
      {resizing && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 99998,
            cursor: 'row-resize',
            background: 'transparent',
          }}
          onMouseDown={(e) => e.preventDefault()}
        />
      )}
    </div>
  )
}

export default ResizableCenter
