import type { ReasoningUIPart } from 'ai'
import { MarkdownRenderer } from '@/components/markdown-renderer/markdown-renderer'
import { MessageSpinner } from '../message-spinner'
import { useReasoningContext } from '../message'

export function Reasoning({
  part,
  partIndex,
}: {
  part: ReasoningUIPart
  partIndex: number
}) {
  const context = useReasoningContext()
  const isExpanded = context?.expandedReasoningIndex === partIndex

  if (part.state === 'done' && !part.text) {
    return null
  }

  const text = part.text || '_Thinking_'
  const isStreaming = part.state === 'streaming'
  const firstLine = text.split('\n')[0].replace(/\*\*/g, '')
  const hasMoreContent = text.includes('\n') || text.length > 80

  const handleClick = () => {
    if (hasMoreContent && context) {
      const newIndex = isExpanded ? null : partIndex
      context.setExpandedReasoningIndex(newIndex)
    }
  }

  return (
    <div
      className="text-sm border border-border bg-background rounded-md cursor-pointer hover:bg-accent/30 transition-colors"
      onClick={handleClick}
    >
      <div className="px-3 py-2">
        <div className="text-secondary-foreground font-mono leading-normal">
          {isExpanded || !hasMoreContent ? (
            <MarkdownRenderer content={text} />
          ) : (
            <div className="overflow-hidden">{firstLine}</div>
          )}
          {isStreaming && isExpanded && <MessageSpinner />}
        </div>
      </div>
    </div>
  )
}
