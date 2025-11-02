import React from 'react'
import { Loader, Send, X } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (next: string) => void
  onSend: () => void | Promise<void>
  sendDisabled: boolean
  showCancel: boolean
  onCancel: () => void
  cancelling: boolean
  // Optional list of suggested prompts that, when clicked, populate the input
  suggestions?: string[]
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  sendDisabled,
  showCancel,
  onCancel,
  cancelling,
  suggestions,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const MAX_TEXTAREA_HEIGHT =
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400

  const adjustTextareaHeight = React.useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)
      el.style.height = `${nextHeight}px`
      // Allow the textarea to scroll internally once it reaches the cap
      el.style.overflowY =
        el.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
    }
  }, [MAX_TEXTAREA_HEIGHT])

  React.useEffect(() => {
    adjustTextareaHeight()
  }, [value, adjustTextareaHeight])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div
      className="p-4"
      style={{
        borderTop: '1px solid var(--vscode-panel-border)',
        background: 'var(--vscode-sidebar)',
      }}
    >
      {/* Suggestions list - only when empty and not sending */}
      {!value.trim() && (suggestions?.length || 0) > 0 ? (
        <div className="mb-3">
          <div
            className="text-xs mb-2"
            style={{ color: 'var(--vscode-muted)' }}
          >
            Click and try one of these prompts:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions!.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(s)
                  requestAnimationFrame(() => {
                    textareaRef.current?.focus()
                    adjustTextareaHeight()
                  })
                }}
                className="text-left px-3 py-2 rounded-sm"
                style={{
                  border: '1px dashed var(--vscode-panel-border)',
                  background: 'var(--vscode-panel)',
                  color: 'var(--vscode-text)',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            adjustTextareaHeight()
          }}
          onKeyDown={handleKeyPress}
          placeholder="Plan, search, build anything"
          disabled={sendDisabled}
          className="flex-1 resize-none rounded-sm px-3 py-2 placeholder-gray-400 focus:outline-none disabled:opacity-50"
          style={{
            backgroundColor: 'var(--vscode-contrast)',
            border: '1px solid var(--vscode-panel-border)',
            color: 'var(--vscode-text)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            maxHeight: `${MAX_TEXTAREA_HEIGHT}px`,
          }}
        />
        {!sendDisabled && (
          <button
            onClick={() => onSend()}
            disabled={!value.trim()}
            className="w-8 h-8 rounded-sm disabled:opacity-50 flex-shrink-0 flex items-center justify-center cursor-pointer"
            style={{ background: 'var(--vscode-accent)', color: '#ffffff' }}
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
        {sendDisabled && showCancel && (
          <button
            onClick={onCancel}
            disabled={cancelling}
            className="w-8 h-8 flex items-center justify-center rounded-sm disabled:opacity-50 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ background: 'var(--vscode-danger)', color: '#ffffff' }}
            title="Cancel current task"
          >
            {cancelling ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
