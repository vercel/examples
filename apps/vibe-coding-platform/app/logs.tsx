'use client'

import { CommandsLogs } from '@/components/commands-logs/commands-logs'
import { useSandboxStore } from './state'
import { useCommandLogs } from '@/hooks/use-command-logs'

export function Logs(props: { className?: string }) {
  const { commands } = useSandboxStore()

  // Stream logs for running commands
  useCommandLogs()

  return <CommandsLogs className={props.className} commands={commands} />
}
