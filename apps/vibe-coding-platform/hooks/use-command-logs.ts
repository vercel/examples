'use client'

import { useEffect, useRef } from 'react'
import { useSandboxStore } from '@/app/state'
import type { CommandLog } from '@/components/commands-logs/types'

/**
 * Hook that automatically fetches logs for running commands.
 *
 * This hook watches for commands without an exitCode and streams
 * their logs from the API endpoint.
 */
export function useCommandLogs() {
  const { commands, addLog } = useSandboxStore()
  const activeStreams = useRef<Set<string>>(new Set())

  useEffect(() => {
    console.log(
      '[useCommandLogs] Commands updated:',
      commands.map((c) => ({
        cmdId: c.cmdId,
        command: c.command,
        exitCode: c.exitCode,
        logCount: c.logs?.length || 0,
      }))
    )

    // Find commands that need log streaming (no exitCode yet)
    const runningCommands = commands.filter(
      (cmd) =>
        cmd.exitCode === undefined && !activeStreams.current.has(cmd.cmdId)
    )

    console.log(
      '[useCommandLogs] Running commands to stream:',
      runningCommands.map((c) => c.cmdId)
    )

    for (const cmd of runningCommands) {
      activeStreams.current.add(cmd.cmdId)
      console.log(`[useCommandLogs] Starting stream for ${cmd.cmdId}`)
      streamLogs(cmd.sandboxId, cmd.cmdId, addLog, () => {
        console.log(`[useCommandLogs] Stream completed for ${cmd.cmdId}`)
        activeStreams.current.delete(cmd.cmdId)
      })
    }
  }, [commands, addLog])
}

async function streamLogs(
  sandboxId: string,
  cmdId: string,
  addLog: (data: { sandboxId: string; cmdId: string; log: CommandLog }) => void,
  onComplete: () => void
) {
  const url = `/api/sandboxes/${sandboxId}/cmds/${cmdId}/logs`
  console.log(`[streamLogs] Fetching logs from: ${url}`)

  try {
    const response = await fetch(url)

    console.log(`[streamLogs] Response status: ${response.status}`)

    if (!response.ok || !response.body) {
      console.error(
        `[streamLogs] Failed to fetch logs for ${cmdId}:`,
        response.status
      )
      onComplete()
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Process complete lines (NDJSON)
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue

        try {
          const data = JSON.parse(line)

          // Check if this is a log entry (skip 'info' stream which is just status)
          if (
            data.data &&
            data.stream &&
            data.timestamp &&
            data.stream !== 'info'
          ) {
            addLog({
              sandboxId,
              cmdId,
              log: {
                data: data.data,
                stream: data.stream as 'stdout' | 'stderr',
                timestamp: data.timestamp,
              },
            })
          }

          // Check if command is done
          if (data.done) {
            onComplete()
            return
          }
        } catch (e) {
          console.warn('Failed to parse log line:', line)
        }
      }
    }

    onComplete()
  } catch (error) {
    console.error(`Error streaming logs for ${cmdId}:`, error)
    onComplete()
  }
}
