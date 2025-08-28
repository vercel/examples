import type { DataPart } from '@/ai/messages/data-parts'
import { MessageSpinner } from '../message-spinner'
import { SquareChevronRightIcon } from 'lucide-react'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import { cn } from '@/lib/utils'
import Markdown from 'react-markdown'

export function RunCommand(props: {
  className?: string
  message: DataPart['run-command']
}) {
  return (
    <ToolMessage className={cn(props.className)}>
      <ToolHeader>
        <SquareChevronRightIcon className="w-3.5 h-3.5" />
        {props.message.status === 'loading' ? (
          <span>Dispatching Command</span>
        ) : (
          <span>Command Dispatched</span>
        )}
      </ToolHeader>
      <div>
        <span>
          <Markdown>{`\`${props.message.command} ${props.message.args.join(
            ' '
          )}\``}</Markdown>
          {props.message.status === 'loading' && <MessageSpinner />}
        </span>
      </div>
    </ToolMessage>
  )
}
