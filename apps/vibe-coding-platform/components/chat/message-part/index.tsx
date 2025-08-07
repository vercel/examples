import type { Metadata } from '@/ai/messages/metadata'
import type { DataPart } from '@/ai/messages/data-parts'
import type { ToolSet } from '@/ai/tools'
import type { UIMessage } from 'ai'

import { GenerateFiles } from './generate-files'
import { CreateSandbox } from './create-sandbox'
import { GetSandboxURL } from './get-sandbox-url'
import { RunCommand } from './run-command'
import { WaitCommand } from './wait-command'
import { Reasoning } from './reasoning'
import { Text } from './text'

interface Props {
  part: UIMessage<Metadata, DataPart, ToolSet>['parts'][number]
}

export function MessagePart({ part }: Props) {
  if (part.type === 'data-generating-files') {
    return <GenerateFiles message={part.data} />
  } else if (part.type === 'data-create-sandbox') {
    return <CreateSandbox message={part.data} />
  } else if (part.type === 'data-get-sandbox-url') {
    return <GetSandboxURL message={part.data} />
  } else if (part.type === 'data-run-command') {
    return <RunCommand message={part.data} />
  } else if (part.type === 'data-wait-command') {
    return <WaitCommand message={part.data} />
  } else if (part.type === 'reasoning') {
    return <Reasoning part={part} />
  } else if (part.type === 'text') {
    return <Text part={part} />
  } else if (part.type) {
    // console.log(JSON.stringify(part, undefined, 4));
  }
}
