import React from 'react'

export const ExecResultItem: React.FC<{
  actionId: string
  output?: string
  long: boolean
  open: boolean
  onToggle: (id: string) => void
}> = ({ actionId, output, long, open, onToggle }) => {
  return (
    <>
      <pre
        className="p-3 text-xs whitespace-pre-wrap font-mono"
        style={{
          color: 'var(--vscode-text)',
          maxHeight: !open && long ? '200px' : undefined,
          overflow: !open && long ? 'hidden' : 'auto',
        }}
      >
        <code>{output || ''}</code>
      </pre>
      {!open && long && (
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: '36px',
            height: '48px',
            background:
              'linear-gradient(180deg, rgba(15,15,15,0) 0%, rgba(15,15,15,1) 80%)',
          }}
        />
      )}
      {long && (
        <div className="flex items-center justify-end px-2 py-2">
          <button
            onClick={() => onToggle(actionId)}
            className="px-2 py-1 rounded-sm text-xs"
            style={{
              background: 'var(--vscode-surface)',
              color: 'var(--vscode-text)',
            }}
          >
            {open ? 'Collapse' : 'Expand'}
          </button>
        </div>
      )}
    </>
  )
}
