import type { ChatUIMessage } from '@/lib/types'
import { BotIcon, UserIcon } from 'lucide-react'
import { memo } from 'react'
import { Streamdown } from 'streamdown'
import { BashCall } from './bash-call'
import { cn } from '@/lib/utils'

export const Message = memo(function Message({
  message,
}: {
  message: ChatUIMessage
}) {
  const isUser = message.role === 'user'

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-mono text-xs font-medium text-muted-foreground">
        {isUser ? (
          <>
            <UserIcon className="size-3.5" />
            <span>You</span>
          </>
        ) : (
          <>
            <BotIcon className="size-3.5" />
            <span>Agent</span>
          </>
        )}
      </div>

      <div className="space-y-2">
        {message.parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div
                key={index}
                className={cn(
                  'rounded-md px-3.5 py-3 text-sm',
                  isUser
                    ? 'bg-secondary text-secondary-foreground'
                    : 'prose prose-sm prose-neutral max-w-none dark:prose-invert'
                )}
              >
                {isUser ? (
                  part.text
                ) : (
                  <Streamdown>{part.text}</Streamdown>
                )}
              </div>
            )
          }
          if (part.type === 'tool-bash') {
            return <BashCall key={index} part={part} />
          }
          return null
        })}
      </div>
    </div>
  )
})
