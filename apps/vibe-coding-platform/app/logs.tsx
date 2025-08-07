'use client'

import { CommandsLogs } from '@/components/commands-logs/commands-logs'
import { useSandboxStore } from './state'

export function Logs(props: { className?: string }) {
  const { commands, addLog, upsertCommand } = useSandboxStore()
  return (
    <CommandsLogs
      className={props.className}
      commands={commands}
      onLog={(data) => {
        addLog({
          sandboxId: data.sandboxId,
          cmdId: data.cmdId,
          log: data.log,
        })
      }}
      onCompleted={(data) => {
        upsertCommand(data)
      }}
    />
  )
}
