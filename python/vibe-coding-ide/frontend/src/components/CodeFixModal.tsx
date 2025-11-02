import React from 'react'

type CodeFixModalProps = {
  visible: boolean
  fileName: string
  startLine: number
  endLine: number
  selectedCode: string
  onClose: () => void
  onSubmit: (instruction: string) => void
}

export const CodeFixModal: React.FC<CodeFixModalProps> = ({
  visible,
  fileName,
  startLine,
  endLine,
  selectedCode,
  onClose,
  onSubmit,
}) => {
  const [instruction, setInstruction] = React.useState<string>('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (visible) {
      setInstruction('')
      // Focus instruction input when opening
      requestAnimationFrame(() => textareaRef.current?.focus())
    }
  }, [visible])

  if (!visible) return null

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
        className="relative w-full max-w-2xl rounded shadow-lg overflow-hidden"
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
            Fix code in {fileName} (lines {startLine}-{endLine})
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div>
            <div
              className="text-xs mb-2"
              style={{ color: 'var(--vscode-muted)' }}
            >
              Selected code
            </div>
            <pre
              className="text-xs p-3 rounded overflow-auto"
              style={{
                maxHeight: '220px',
                background: 'var(--vscode-bg)',
                border: '1px solid var(--vscode-panel-border)',
                color: 'var(--vscode-text)',
              }}
            >
              <code>{selectedCode}</code>
            </pre>
          </div>
          <div>
            <div
              className="text-xs mb-2"
              style={{ color: 'var(--vscode-muted)' }}
            >
              Describe how to change this code
            </div>
            <textarea
              ref={textareaRef}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={4}
              placeholder="E.g., fix the bug, add error handling, refactor to be async, etc."
              className="w-full rounded-sm px-3 py-2"
              style={{
                background: 'var(--vscode-contrast)',
                border: '1px solid var(--vscode-panel-border)',
                color: 'var(--vscode-text)',
                resize: 'vertical',
              }}
            />
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
              onClick={() => {
                if (instruction.trim()) onSubmit(instruction.trim())
              }}
              disabled={!instruction.trim()}
              className="px-3 py-1 rounded-sm disabled:opacity-50 cursor-pointer"
              style={{ background: 'var(--vscode-accent)', color: '#ffffff' }}
            >
              Ask AI to fix
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeFixModal
