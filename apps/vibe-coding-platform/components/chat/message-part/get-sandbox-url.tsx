import type { DataPart } from '@/ai/messages/data-parts'
import { LinkIcon } from 'lucide-react'
import { MessageSpinner } from '../message-spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import { cn } from '@/lib/utils'

export function GetSandboxURL(props: {
  className?: string
  message: DataPart['get-sandbox-url']
}) {
  return (
    <ToolMessage className={cn(props.className)}>
      <ToolHeader>
        <LinkIcon className="w-3.5 h-3.5" />
        {!props.message.url ? (
          <span>Getting Sandbox URL</span>
        ) : (
          <span>Got Sandbox URL</span>
        )}
      </ToolHeader>
      <div>
        {!props.message.url && <MessageSpinner />}
        {props.message.url && (
          <a href={props.message.url} target="_blank">
            {props.message.url}
          </a>
        )}
      </div>
    </ToolMessage>
  )
}
