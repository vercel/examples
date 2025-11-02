import React from 'react'

export const MiniTerminal: React.FC<{
  command: string
  cwd?: string
  status: 'running' | 'done' | 'failed'
  output?: string
  sandboxName?: string
}> = ({ command, cwd, status, output, sandboxName }) => {
  const [open, setOpen] = React.useState(false)
  const scrollRef = React.useRef<HTMLPreElement | null>(null)
  const tailText = React.useMemo(() => {
    const lines = (output || '').split('\n')
    return lines.slice(Math.max(0, lines.length - 2)).join('\n')
  }, [output])

  React.useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [open, output])

  const lineHeightPx = 16

  return (
    <div
      className="text-xs"
      style={{
        border: '1px solid var(--vscode-panel-border)',
        borderRadius: 6,
        overflow: 'hidden',
        background: 'var(--vscode-panel)',
      }}
    >
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{
          background: 'var(--vscode-surface)',
          borderBottom: '1px solid var(--vscode-panel-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 9999,
              background:
                status === 'failed'
                  ? '#ff5f57'
                  : status === 'done'
                  ? '#28c840'
                  : '#ffbd2e',
            }}
          />
          <span style={{ color: 'var(--vscode-subtle)' }}>
            {cwd ? `${cwd} $` : '$'}
          </span>
          {sandboxName ? (
            <span
              className="ml-2 px-1 py-0.5 rounded-sm"
              style={{
                border: '1px solid var(--vscode-panel-border)',
                color: 'var(--vscode-subtle)',
              }}
            >
              {sandboxName}
            </span>
          ) : null}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-2 py-0.5 rounded-sm"
          style={{
            background: 'var(--vscode-surface)',
            color: 'var(--vscode-text)',
            border: '1px solid var(--vscode-panel-border)',
          }}
        >
          {open ? 'Hide output' : 'Show output'}
        </button>
      </div>
      <pre
        className="m-0 p-2 font-mono whitespace-pre-wrap"
        style={{ color: 'var(--vscode-text)' }}
      >
        <code>{command}</code>
      </pre>
      {!open &&
        Boolean(tailText) &&
        (status === 'running' ? (
          <div
            style={{
              borderTop: '1px dashed var(--vscode-panel-border)',
              position: 'relative',
            }}
            aria-live="polite"
          >
            <div
              style={{
                height: `${2 * lineHeightPx + 4}px`,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <pre
                className="m-0 px-2 font-mono text-xs whitespace-pre-wrap"
                style={{
                  color: 'var(--vscode-subtle)',
                  lineHeight: `${lineHeightPx}px`,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <code>{tailText}</code>
              </pre>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 14,
                  background:
                    'linear-gradient(180deg, var(--vscode-panel) 0%, rgba(0,0,0,0) 85%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        ) : null)}
      {open && (
        <div style={{ borderTop: '1px dashed var(--vscode-panel-border)' }}>
          <pre
            ref={scrollRef}
            className="m-0 p-2 font-mono text-xs whitespace-pre-wrap"
            style={{
              color: 'var(--vscode-subtle)',
              maxHeight: 240,
              overflow: 'auto',
            }}
          >
            <code>{output || ''}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
