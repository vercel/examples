import type { DataPart } from '@/ai/messages/data-parts'
import { CloudUploadIcon } from 'lucide-react'
import { MessageSpinner } from '../message-spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'

export function GenerateFiles(props: {
  className?: string
  message: DataPart['generating-files']
}) {
  const generated =
    props.message.status === 'generating'
      ? props.message.paths.slice(0, props.message.paths.length - 1)
      : props.message.paths

  const generating =
    props.message.status === 'generating'
      ? props.message.paths[props.message.paths.length - 1]
      : null

  return (
    <ToolMessage className={props.className}>
      <ToolHeader>
        <CloudUploadIcon className="w-3.5 h-3.5" />
        <span>
          {props.message.status === 'done'
            ? 'Uploaded files'
            : 'Generating files'}
        </span>
      </ToolHeader>

      <div className="pl-2 space-y-0.5">
        {generated.map((path) => (
          <div className="whitespace-pre-wrap" key={'gen' + path}>
            ✔︎ {path}
          </div>
        ))}
        {generating && (
          <div className="whitespace-pre-wrap">
            <span>{`  ${generating}`}</span>
          </div>
        )}
        {props.message.status !== 'done' && <MessageSpinner />}
      </div>
    </ToolMessage>
  )
}
