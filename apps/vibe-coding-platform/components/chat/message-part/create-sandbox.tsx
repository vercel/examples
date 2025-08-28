import type { DataPart } from '@/ai/messages/data-parts'
import { BoxIcon } from 'lucide-react'
import { MessageSpinner } from '../message-spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import { cn } from '@/lib/utils'
import Markdown from 'react-markdown'

export function CreateSandbox(props: {
  className?: string
  message: DataPart['create-sandbox']
}) {
  return (
    <ToolMessage className={cn(props.className)}>
      <ToolHeader>
        <BoxIcon className="w-3.5 h-3.5" />
        {props.message.status === 'loading' ? (
          <span>Creating Sandbox</span>
        ) : (
          <span>Created Sandbox</span>
        )}
      </ToolHeader>
      <div>
        {props.message.status === 'loading' && <MessageSpinner />}
        {props.message.sandboxId && (
          <Markdown>{`Sandbox created with id \`${props.message.sandboxId}\``}</Markdown>
        )}
      </div>
    </ToolMessage>
  )
}
