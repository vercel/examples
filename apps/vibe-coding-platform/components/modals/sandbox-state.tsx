'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { PlayIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSandboxStore } from '@/app/state'
import { projectFetch } from '@/lib/project-client'

export function SandboxState() {
  const { sandboxId, status, setStatus, applyToolOutput } = useSandboxStore()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const { data, mutate } = useSWR(
    sandboxId ? `/api/sandboxes/${sandboxId}` : null,
    async (url: string) =>
      (await projectFetch(url)).json() as Promise<{
        status: 'running' | 'stopped'
      }>,
    { refreshInterval: 15_000 }
  )
  useEffect(() => {
    if (data) {
      setStatus(data.status)
      applyToolOutput(data)
    }
  }, [data, setStatus, applyToolOutput])

  async function resume() {
    setPending(true)
    setError(undefined)
    try {
      const response = await projectFetch(`/api/sandboxes/${sandboxId}`, {
        method: 'POST',
      })
      applyToolOutput(await response.json())
      setStatus('running')
      await mutate()
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not resume workspace'
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={status === 'stopped'}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace paused</DialogTitle>
          <DialogDescription>Your project files are saved.</DialogDescription>
        </DialogHeader>
        {error && <p role="alert">{error}</p>}
        <Button disabled={pending} onClick={() => void resume()}>
          <PlayIcon className="size-4 mr-2" />
          {pending ? 'Resuming...' : 'Resume workspace'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
