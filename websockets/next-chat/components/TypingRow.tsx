import { cn } from '@/lib/cn'
import { MAX_MESSAGE_LENGTH } from '@/lib/protocol'

const WARN_THRESHOLD = MAX_MESSAGE_LENGTH - 150 // start showing the counter

// Reserved row layout — shared by all three states below. Fixed min-height so it
// never shifts the conversation when its contents appear/disappear.
const ROW =
  'flex min-h-[1.6rem] items-center gap-2 px-4 pb-[0.1rem] text-[0.78rem]'

// The reserved row above the composer shows ONE thing at a time, by priority:
//   1. your message-length status (warning near the cap, error past it)
//   2. others' typing indicator
//   3. nothing (reserved space, so it never shifts the conversation)
// Length takes priority so an over-limit error is never hidden by "X is typing".
export function TypingRow({
  draftLength,
  typingUsers,
}: {
  draftLength: number
  typingUsers: string[]
}) {
  if (draftLength >= WARN_THRESHOLD) {
    const over = draftLength > MAX_MESSAGE_LENGTH
    return (
      <div
        className={cn(ROW, over ? 'font-mono text-[#e5484d]' : 'text-muted')}
        aria-live="polite"
      >
        <span>
          {over
            ? `Message too long — ${draftLength}/${MAX_MESSAGE_LENGTH}`
            : `${draftLength}/${MAX_MESSAGE_LENGTH}`}
        </span>
      </div>
    )
  }

  if (typingUsers.length === 0) {
    return <div className={cn(ROW, 'text-muted')} aria-live="polite" />
  }

  let label: string
  if (typingUsers.length === 1) label = `${typingUsers[0]} is typing`
  else if (typingUsers.length === 2)
    label = `${typingUsers[0]} and ${typingUsers[1]} are typing`
  else label = 'Several people are typing'

  return (
    <div className={cn(ROW, 'text-muted')} aria-live="polite">
      {/* Animated dots stay as a custom class — the staggered keyframes don't
          express cleanly as utilities (see .dots in globals.css). */}
      <span className="dots">
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </div>
  )
}
