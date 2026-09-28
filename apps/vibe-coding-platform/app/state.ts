import type { Command, CommandLog } from '@/components/commands-logs/types'
import { useMemo } from 'react'
import { create } from 'zustand'
import { z } from 'zod'

const outputSchema = z.object({
  sandboxId: z.string().optional(),
  paths: z.array(z.string()).optional(),
  replacePaths: z.boolean().optional(),
  url: z.string().url().optional(),
  commandId: z.string().optional(),
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
  status: z.string().optional(),
  exitCode: z.number().optional(),
})

interface SandboxStore {
  sandboxId?: string
  status?: 'running' | 'stopped'
  chatStatus: 'ready' | 'resuming' | 'submitted' | 'streaming' | 'error'
  paths: string[]
  commands: Command[]
  url?: string
  urlUUID?: string
  reset: () => void
  applyToolOutput: (output: unknown) => void
  addLog: (data: { sandboxId: string; cmdId: string; log: CommandLog }) => void
  upsertCommand: (command: Omit<Command, 'startedAt'>) => void
  setChatStatus: (status: SandboxStore['chatStatus']) => void
  setStatus: (status: 'running' | 'stopped') => void
}

export const useSandboxStore = create<SandboxStore>()((set) => ({
  paths: [],
  commands: [],
  chatStatus: 'ready',
  reset: () =>
    set({
      sandboxId: undefined,
      status: undefined,
      paths: [],
      commands: [],
      url: undefined,
      urlUUID: undefined,
    }),
  setChatStatus: (chatStatus) => set({ chatStatus }),
  setStatus: (status) => set({ status }),
  applyToolOutput: (output) => {
    const parsed = outputSchema.safeParse(output)
    if (!parsed.success) return
    const data = parsed.data
    set((state) => {
      const next = { ...state }
      if (data.sandboxId) next.sandboxId = data.sandboxId
      if (data.paths)
        next.paths = [
          ...new Set([
            ...(data.replacePaths ? [] : state.paths),
            ...data.paths,
          ]),
        ]
      if (data.url) {
        next.url = data.url
        next.urlUUID = data.url
      }
      if (data.commandId && data.sandboxId && data.command && data.args) {
        const previous = state.commands.find(
          (command) => command.cmdId === data.commandId
        )
        const command = {
          ...previous,
          sandboxId: data.sandboxId,
          cmdId: data.commandId,
          command: data.command,
          args: data.args,
          background: data.status === 'running',
          startedAt: previous?.startedAt ?? Date.now(),
          exitCode: data.exitCode ?? previous?.exitCode,
        }
        next.commands = [
          ...state.commands.filter((item) => item.cmdId !== command.cmdId),
          command,
        ]
      }
      return next
    })
  },
  addLog: ({ sandboxId, cmdId, log }) =>
    set((state) => ({
      commands: state.commands.map((command) =>
        command.cmdId === cmdId && command.sandboxId === sandboxId
          ? { ...command, logs: [...(command.logs ?? []), log] }
          : command
      ),
    })),
  upsertCommand: (command) =>
    set((state) => {
      const previous = state.commands.find(
        (item) => item.cmdId === command.cmdId
      )
      return {
        commands: [
          ...state.commands.filter((item) => item.cmdId !== command.cmdId),
          { startedAt: Date.now(), ...previous, ...command },
        ],
      }
    }),
}))

export function useCommandErrorsLogs() {
  const commands = useSandboxStore((state) => state.commands)
  const errors = useMemo(
    () =>
      commands
        .flatMap(({ command, args, background, logs = [] }) =>
          logs
            .filter((log) => background && log.stream === 'stderr')
            .map((log) => ({ command, args, background, ...log }))
        )
        .sort((a, b) => a.timestamp - b.timestamp),
    [commands]
  )
  return { errors }
}
