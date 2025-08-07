'use client'

import type { Command, CommandLog } from './types'
import { CommandLogs } from './command-logs'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SquareChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  commands: Command[]
  onLog: (data: { sandboxId: string; cmdId: string; log: CommandLog }) => void
  onCompleted: (data: Command) => void
}

export function CommandsLogs(props: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [props.commands])

  return (
    <Panel className={props.className}>
      <PanelHeader>
        <SquareChevronRight className="mr-2 w-4" />
        <span className="font-mono uppercase font-semibold">
          Sandbox Remote Output
        </span>
      </PanelHeader>
      <div className="h-[calc(100%-2rem)]">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {props.commands.map((command) => (
              <CommandLogs
                key={command.cmdId}
                command={command}
                onLog={props.onLog}
                onCompleted={props.onCompleted}
              />
            ))}
          </div>
          <div ref={bottomRef} />
        </ScrollArea>
      </div>
    </Panel>
  )
}
