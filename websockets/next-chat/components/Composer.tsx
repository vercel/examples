'use client'

import { useRef } from 'react'
import { SendIcon } from '@/components/icons'
import { MAX_MESSAGE_LENGTH } from '@/lib/protocol'

export function Composer({
  draft,
  onDraftChange,
  onSend,
  onTyping,
}: {
  draft: string
  onDraftChange: (value: string) => void
  onSend: (text: string) => void
  onTyping: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // A disabled send button still lets Enter fire submit, so guard here too.
    if (!draft.trim() || draft.length > MAX_MESSAGE_LENGTH) return
    onSend(draft)
    onDraftChange('')
    inputRef.current?.focus()
  }

  return (
    <form
      className="sticky bottom-0 flex flex-col gap-[0.4rem] border-t border-border bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[16px] backdrop-saturate-[1.8]"
      autoComplete="off"
      onSubmit={submit}
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message…"
          aria-label="Message"
          autoFocus
          value={draft}
          onChange={(e) => {
            onDraftChange(e.target.value)
            onTyping()
          }}
          className="flex-1 rounded-full border border-border-strong bg-background px-4 py-[0.7rem] text-base text-foreground outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-4 focus:ring-accent-glow"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={draft.length > MAX_MESSAGE_LENGTH}
          className="grid size-[2.7rem] shrink-0 place-items-center rounded-full border-0 bg-accent text-accent-foreground transition hover:opacity-90 active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-[19px]"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  )
}
