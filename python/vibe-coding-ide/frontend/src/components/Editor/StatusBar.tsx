import React from 'react'
import { useProjects } from '../../context/ProjectsContext'

type StatusBarProps = {
  line: number
  column: number
  language: string
}

export const StatusBar: React.FC<StatusBarProps> = ({
  line,
  column,
  language,
}) => {
  const {
    sandboxStatus,
    markSyncOnNextRun,
    sandboxAheadPaths,
    divergedPaths,
    hasSandboxBaseline,
    autoSyncing,
    syncSandboxNow,
  } = useProjects()
  const [panelOpen, setPanelOpen] = React.useState<boolean>(false)

  const prettyLanguage = React.useMemo(() => {
    if (!language) return 'Plain Text'
    const map: Record<string, string> = {
      plaintext: 'Plain Text',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      json: 'JSON',
      css: 'CSS',
      html: 'HTML',
      markdown: 'Markdown',
      python: 'Python',
      go: 'Go',
      rust: 'Rust',
      java: 'Java',
      ruby: 'Ruby',
      php: 'PHP',
      shell: 'Shell',
      yaml: 'YAML',
      toml: 'TOML',
      c: 'C',
      cpp: 'C++',
      csharp: 'C#',
      kotlin: 'Kotlin',
      swift: 'Swift',
      sql: 'SQL',
    }
    return map[language] || language[0]?.toUpperCase() + language.slice(1)
  }, [language])

  // No account/auth button anymore

  return (
    <div
      className="fixed inset-x-0 flex items-center justify-between text-xs"
      style={{
        bottom: 0,
        height: 'var(--statusbar-height)',
        backgroundColor: 'var(--vscode-panel)',
        borderTop: '1px solid var(--vscode-panel-border)',
        color: 'var(--vscode-text)',
        zIndex: 100000,
        overflow: 'hidden',
      }}
      role="status"
      aria-label="Editor status bar"
    >
      <div className="flex items-center">
        {hasSandboxBaseline && (
          <div className="ml-2 relative">
            {sandboxStatus.editorAhead +
              sandboxStatus.sandboxAhead +
              sandboxStatus.diverged >
              0 && (
              <button
                onClick={() => setPanelOpen((v) => !v)}
                className="px-2 h-[var(--statusbar-height)] text-xs rounded-sm"
                style={{
                  background: 'var(--vscode-surface)',
                  color: 'var(--vscode-text)',
                  border: '1px solid var(--vscode-panel-border)',
                }}
                title="Sandbox sync"
              >
                {autoSyncing ? 'Syncing…' : 'Sandbox out of sync'}
              </button>
            )}
            {panelOpen && (
              <div
                className="absolute left-0 mt-1 p-2 rounded-sm z-10 min-w-[220px]"
                style={{
                  background: 'var(--vscode-panel)',
                  border: '1px solid var(--vscode-panel-border)',
                }}
              >
                <div
                  className="text-xs mb-2"
                  style={{ color: 'var(--vscode-text)' }}
                >
                  Editor ahead: {sandboxStatus.editorAhead} · Sandbox ahead:{' '}
                  {sandboxStatus.sandboxAhead} · Diverged:{' '}
                  {sandboxStatus.diverged}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      markSyncOnNextRun()
                      setPanelOpen(false)
                    }}
                    className="px-2 py-1 rounded-sm text-xs"
                    style={{
                      background: 'var(--vscode-accent)',
                      color: '#ffffff',
                      border: '1px solid var(--vscode-panel-border)',
                    }}
                    title="Push editor changes to sandbox on next run"
                  >
                    Update Sandbox (next run)
                  </button>
                  <button
                    onClick={async () => {
                      await syncSandboxNow()
                      setPanelOpen(false)
                    }}
                    className="px-2 py-1 rounded-sm text-xs"
                    style={{
                      background: 'var(--vscode-surface)',
                      color: 'var(--vscode-text)',
                      border: '1px solid var(--vscode-panel-border)',
                    }}
                    title="Sync now"
                  >
                    Sync now
                  </button>
                  <div
                    className="text-xs"
                    style={{ color: 'var(--vscode-muted)' }}
                  >
                    If auto-sync reports &quot;no sandboxes mapped&quot;, run
                    the code again to start a fresh sandbox.
                  </div>
                  {sandboxAheadPaths.length + divergedPaths.length > 0 && (
                    <div
                      className="text-xs"
                      style={{ color: 'var(--vscode-muted)' }}
                    >
                      Pull Sandbox Changes will appear automatically after runs
                      that include file data.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mr-4">
        <div title="Language" aria-label="Language">
          {prettyLanguage}
        </div>
        <div
          title={`Line ${line}, Column ${column}`}
          aria-label="Cursor position"
        >
          Ln {line}, Col {column}
        </div>
      </div>
    </div>
  )
}

export default StatusBar
