import React from 'react'

interface TerminalPaneProps {
  title?: string
  height?: number
  logs?: string
  onClear?: () => void
}

export const TerminalPane: React.FC<TerminalPaneProps> = ({
  title = 'Terminal',
  height = 200,
  logs,
  onClear,
}) => {
  const promptSymbol = '$'
  const content =
    logs && logs.length > 0
      ? logs
      : `${promptSymbol} waiting for output...\n${promptSymbol} `
  return (
    <div
      className="flex flex-col"
      style={{
        height: `${height}px`,
        borderTop: '1px solid var(--vscode-panel-border)',
        backgroundColor: 'var(--vscode-bg)',
      }}
    >
      <div
        className="px-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--vscode-panel)',
          borderBottom: '1px solid var(--vscode-panel-border)',
          height: 'var(--header-height)',
        }}
      >
        <div
          className="text-xs font-medium"
          style={{ color: 'var(--vscode-text)' }}
        >
          {title}
        </div>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: 'var(--vscode-subtle)' }}
        >
          <button
            onClick={onClear}
            className="px-2 py-0.5 rounded-sm cursor-pointer"
            style={{
              background: 'var(--vscode-surface)',
              color: 'var(--vscode-text)',
            }}
            disabled={!onClear}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <pre
          className="p-3 text-xs whitespace-pre-wrap font-mono"
          style={{ color: '#d4d4d4' }}
        >
          {content}
        </pre>
      </div>
    </div>
  )
}

export default TerminalPane
