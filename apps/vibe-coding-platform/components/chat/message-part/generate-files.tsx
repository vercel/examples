import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, CloudUploadIcon, XIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'

export function GenerateFiles(props: {
  className?: string
  message: DataPart['generating-files']
}) {
  const lastInProgress = ['error', 'uploading', 'generating'].includes(
    props.message.status
  )

  const generated = lastInProgress
    ? props.message.paths.slice(0, props.message.paths.length - 1)
    : props.message.paths

  const generating = lastInProgress
    ? props.message.paths[props.message.paths.length - 1] ?? ''
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
      <div className="text-sm relative min-h-5">
        {generated.map((path) => (
          <div className="flex items-center" key={'gen' + path}>
            <CheckIcon className="w-4 h-4 mx-1" />
            <span className="whitespace-pre-wrap">{path}</span>
          </div>
        ))}
        {typeof generating === 'string' && (
          <div className="flex">
            <Spinner
              className="mr-1"
              loading={props.message.status !== 'error'}
            >
              {props.message.status === 'error' ? (
                <XIcon className="w-4 h-4 text-red-700" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
            </Spinner>
            <span>{generating}</span>
          </div>
        )}
      </div>
    </ToolMessage>
  )
}
