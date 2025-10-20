import React from 'react'
import { ExternalLink, RefreshCcw } from 'lucide-react'

export const PreviewCard: React.FC<{
  url: string
  origin: string
  contextLabel?: string
  refreshToken?: number
}> = ({ url, origin, contextLabel, refreshToken }) => {
  const [collapsed, setCollapsed] = React.useState(false)
  const [reloadCount, setReloadCount] = React.useState(0)
  const [timedOut] = React.useState(false)

  React.useEffect(() => {
    if (typeof refreshToken !== 'undefined') {
      setReloadCount((c) => c + 1)
    }
  }, [refreshToken])

  return (
    <div className="text-xs">
      <div className="mb-1" style={{ color: 'var(--vscode-subtle)' }}>
        Preview
      </div>
      <div
        style={{
          border: '1px solid var(--vscode-panel-border)',
          borderRadius: 6,
          overflow: 'hidden',
          backgroundColor: 'var(--vscode-panel)',
        }}
      >
        <div
          className="flex items-center justify-between px-2 py-1"
          style={{
            background: 'var(--vscode-surface)',
            borderBottom: '1px solid var(--vscode-panel-border)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: '#ff5f57',
              }}
            />
            <button
              onClick={() => setCollapsed((v) => !v)}
              title="Minimize"
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: '#ffbd2e',
                border: 0,
                padding: 0,
              }}
            />
            <a
              href={url}
              title="Open in new tab"
              target="_blank"
              rel="noreferrer"
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: '#28c840',
                display: 'inline-block',
              }}
            />
            <div
              className="ml-2 flex items-center gap-2 min-w-0"
              style={{ color: 'var(--vscode-text)' }}
            >
              <button
                type="button"
                onClick={() => setReloadCount((c) => c + 1)}
                className="p-1 rounded hover:bg-opacity-10 hover:bg-white transition-colors"
                title="Refresh preview"
                aria-label="Refresh preview"
                style={{ color: 'var(--vscode-accent)' }}
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
              <span
                className="overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ maxWidth: 200 }}
              >
                {origin}
              </span>
              {contextLabel ? (
                <span
                  className="px-1 py-0.5 rounded-sm"
                  style={{
                    border: '1px solid var(--vscode-panel-border)',
                    color: 'var(--vscode-subtle)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {contextLabel}
                </span>
              ) : null}
              {timedOut ? (
                <span
                  className="px-1 py-0.5 rounded-sm"
                  style={{
                    border: '1px solid var(--vscode-panel-border)',
                    color: 'var(--vscode-subtle)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sandbox timed out
                </span>
              ) : null}
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded hover:bg-opacity-10 hover:bg-white transition-colors"
            style={{ color: 'var(--vscode-accent)' }}
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        {!collapsed && !timedOut && (
          <iframe
            key={`iframe-${reloadCount}`}
            src={url}
            title="Preview"
            style={{
              width: '100%',
              height: 220,
              border: 'none',
              background: '#ffffff',
              colorScheme: 'light',
            }}
          />
        )}
        {!collapsed && timedOut && (
          <div
            className="p-3 text-xs"
            style={{
              color: 'var(--vscode-subtle)',
              background: 'var(--vscode-panel)',
            }}
          >
            Sandbox timed out
          </div>
        )}
      </div>
    </div>
  )
}
