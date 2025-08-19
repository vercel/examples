import type { ChatUIMessage } from './types'
import { MessagePart } from './message-part'
import { BotIcon, UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  message: ChatUIMessage
}

export function Message({ message }: Props) {
  return (
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
          <MessagePart key={index} part={part} />
        ))}
      </div>
    </div>
  )
}
