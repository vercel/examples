import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, PauseIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import Markdown from 'react-markdown'

export function Sleep({ message }: { message: DataPart['wait'] }) {
  return (
    <ToolMessage>
      <ToolHeader>
        <PauseIcon className="w-3.5 h-3.5" /> Paused
      </ToolHeader>
      <div className="relative pl-6">
        <Spinner className="absolute left-0 top-0" loading={false}>
          <CheckIcon className="w-4 h-4" />
        </Spinner>
        <Markdown>{message.text}</Markdown>
      </div>
    </ToolMessage>
  )
}
