import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, LinkIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'

export function GetSandboxURL({
  message,
}: {
  message: DataPart['get-sandbox-url']
}) {
  return (
    <ToolMessage>
      <ToolHeader>
        <LinkIcon className="w-3.5 h-3.5" />
        <span>Get Sandbox URL</span>
      </ToolHeader>
      <div className="relative pl-6 min-h-5">
        <Spinner
          className="absolute left-0 top-0"
          loading={message.status === 'loading'}
        >
          <CheckIcon className="w-4 h-4" />
        </Spinner>
        {message.url ? (
          <a href={message.url} target="_blank">
            {message.url}
          </a>
        ) : (
          <span>Getting Sandbox URL</span>
        )}
      </div>
    </ToolMessage>
  )
}
