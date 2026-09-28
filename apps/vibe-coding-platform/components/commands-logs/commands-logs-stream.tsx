'use client'

import { useEffect } from 'react'
import { useSandboxStore } from '@/app/state'
import stripAnsi from 'strip-ansi'
import z from 'zod/v3'
import { projectFetch } from '@/lib/project-client'

export function CommandLogsStream() {
  const commands = useSandboxStore((state) => state.commands)
  return commands.map(({ sandboxId, cmdId }) => (
    <CommandLogStream
      key={`${sandboxId}:${cmdId}`}
      sandboxId={sandboxId}
      cmdId={cmdId}
    />
  ))
}

function CommandLogStream({
  sandboxId,
  cmdId,
}: {
  sandboxId: string
  cmdId: string
}) {
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const store = useSandboxStore.getState()
    const command = store.commands.find(
      (item) => item.sandboxId === sandboxId && item.cmdId === cmdId
    )
    if (!command) return
    store.upsertCommand({ ...command, logs: [] })

    void (async () => {
      try {
        for await (const log of getCommandLogs(sandboxId, cmdId, signal)) {
          if (signal.aborted) return
          store.addLog({ sandboxId, cmdId, log })
        }
        const response = await projectFetch(
          `/api/sandboxes/${sandboxId}/cmds/${cmdId}`,
          { signal }
        )
        const result = cmdSchema.parse(await response.json())
        const current = useSandboxStore
          .getState()
          .commands.find((item) => item.cmdId === cmdId)
        if (!signal.aborted && current && result.exitCode !== undefined) {
          store.upsertCommand({ ...current, exitCode: result.exitCode })
        }
      } catch {
        if (!signal.aborted) {
          store.addLog({
            sandboxId,
            cmdId,
            log: {
              stream: 'stdout',
              timestamp: Date.now(),
              data: '\nCommand log stream is no longer available.\n',
            },
          })
        }
      }
    })()
    return () => controller.abort()
  }, [sandboxId, cmdId])

  return null
}

const logSchema = z.object({
  data: z.string(),
  stream: z.enum(['stdout', 'stderr']),
  timestamp: z.number(),
})

function parseLog(line: string) {
  const log = logSchema.parse(JSON.parse(line))
  return { ...log, data: stripAnsi(log.data) }
}

async function* getCommandLogs(
  sandboxId: string,
  cmdId: string,
  signal: AbortSignal
) {
  const response = await projectFetch(
    `/api/sandboxes/${sandboxId}/cmds/${cmdId}/logs`,
    { signal }
  )
  if (!response.body) throw new Error('Missing command log stream')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let line = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      line += decoder.decode(value, { stream: !done })
      const lines = line.split('\n')
      line = lines.pop() ?? ''
      for (const entry of lines) {
        if (entry) yield parseLog(entry)
      }
      if (done) {
        if (line) yield parseLog(line)
        break
      }
    }
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

const cmdSchema = z.object({ exitCode: z.number().optional() })
