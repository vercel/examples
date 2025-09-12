import type { ChatUIMessage } from './types'
import { MessagePart } from './message-part'
import { BotIcon, UserIcon } from 'lucide-react'
import { memo, createContext, useContext, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  message: ChatUIMessage
}

interface ReasoningContextType {
  expandedReasoningIndex: number | null
  setExpandedReasoningIndex: (index: number | null) => void
}

const ReasoningContext = createContext<ReasoningContextType | null>(null)

export const useReasoningContext = () => {
  const context = useContext(ReasoningContext)
  return context
}

export const Message = memo(function Message({ message }: Props) {
  const [expandedReasoningIndex, setExpandedReasoningIndex] = useState<
    number | null
  >(null)

  const reasoningParts = message.parts
    .map((part, index) => ({ part, index }))
    .filter(({ part }) => part.type === 'reasoning')

  useEffect(() => {
    if (reasoningParts.length > 0) {
      const latestReasoningIndex =
        reasoningParts[reasoningParts.length - 1].index
      setExpandedReasoningIndex(latestReasoningIndex)
    }
  }, [reasoningParts])

  return (
    <ReasoningContext.Provider
      value={{ expandedReasoningIndex, setExpandedReasoningIndex }}
    >
      <div
        className={cn({
          'mr-20': message.role === 'assistant',
          'ml-20': message.role === 'user',
        })}
      >
        {/* Message Header */}
        <div className="flex items-center gap-2 text-sm font-medium font-mono text-primary mb-1.5">
          {message.role === 'user' ? (
            <>
              <UserIcon className="ml-auto w-4" />
              <span>You</span>
            </>
          ) : (
            <>
              <BotIcon className="w-4" />
              <span>Assistant ({message.metadata?.model})</span>
            </>
          )}
        </div>

        {/* Message Content */}
        <div className="space-y-1.5">
          {message.parts.map((part, index) => (
            <MessagePart key={index} part={part} partIndex={index} />
          ))}
        </div>
      </div>
    </ReasoningContext.Provider>
  )
})
