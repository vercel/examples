import { UIMessageStreamWriter } from 'ai'
import { DataPart } from '../messages/data-parts'
import { UIMessage } from 'ai'

export type UIStreamWriter = UIMessageStreamWriter<UIMessage<never, DataPart>>
