import type { EveMessagePart } from 'eve/react'
import { CheckIcon, LoaderCircleIcon, TerminalIcon, XIcon } from 'lucide-react'
import { Reasoning } from './reasoning'
import { Text } from './text'
import { ToolMessage } from '../tool-message'
import { ToolHeader } from '../tool-header'

export function MessagePart({
  part,
  partIndex,
}: {
  part: EveMessagePart
  partIndex: number
}) {
  if (part.type === 'text') return <Text part={part} />
  if (part.type === 'reasoning')
    return <Reasoning part={part} partIndex={partIndex} />
  if (part.type !== 'dynamic-tool') return null
  const complete = part.state === 'output-available'
  const failed = part.state === 'output-error'
  return (
    <ToolMessage>
      <ToolHeader>
        <TerminalIcon className="size-3.5 shrink-0" />
        <span className="min-w-0 break-words">
          {part.toolName.replaceAll('_', ' ')}
        </span>
        {complete ? (
          <CheckIcon className="ml-auto size-4" />
        ) : failed ? (
          <XIcon className="ml-auto size-4 text-red-600" />
        ) : (
          <LoaderCircleIcon className="ml-auto size-4 animate-spin" />
        )}
      </ToolHeader>
      {failed && <p className="break-words text-red-600">{part.errorText}</p>}
    </ToolMessage>
  )
}
