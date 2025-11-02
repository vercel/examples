import { useRef, useMemo, useCallback } from 'react'
import { API_BASE, SSE_ORIGIN } from '../constants'
import type { AgentEvent } from '../types'

interface UseAgentStreamProps {
  onMessage: (event: AgentEvent) => void
}

export function useAgentStream({ onMessage }: UseAgentStreamProps) {
  const sourcesRef = useRef<Record<string, EventSource>>({})

  const apiOrigin = useMemo(() => {
    // Prefer explicit SSE_ORIGIN to bypass rewrite buffering; otherwise infer from API_BASE.
    if (SSE_ORIGIN) return SSE_ORIGIN
    try {
      const url = new URL(API_BASE)
      const trimmed = API_BASE.replace(/\/?$/, '')
      return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : url.origin
    } catch {
      return API_BASE.replace(/\/?$/, '').replace(/\/api$/, '')
    }
  }, [])

  const connect = useCallback(
    (runId: string, streamToken: string) => {
      const url = `${apiOrigin}/api/runs/${encodeURIComponent(
        runId
      )}/events?token=${encodeURIComponent(streamToken)}`
      const es = new EventSource(url)
      sourcesRef.current[runId] = es
      es.onmessage = (evt) => {
        try {
          const event = JSON.parse(evt.data) as AgentEvent
          onMessage(event)
          if (
            event.event_type === 'agent_output' ||
            event.event_type === 'run_failed' ||
            event.event_type === 'run_cancelled'
          ) {
            try {
              es.close()
            } catch {
              /* noop */
            }
            delete sourcesRef.current[runId]
          }
        } catch (e) {
          console.error('Invalid SSE message', e)
        }
      }
      es.onerror = () => {
        try {
          es.close()
        } catch {
          /* noop */
        }
        delete sourcesRef.current[runId]
      }
    },
    [apiOrigin, onMessage]
  )

  const resume = useCallback(
    (runId: string, resumeToken: string, result: string) => {
      const url = `${apiOrigin}/api/runs/${encodeURIComponent(
        runId
      )}/resume?token=${encodeURIComponent(
        resumeToken
      )}&result=${encodeURIComponent(result)}`
      const es = new EventSource(url)
      sourcesRef.current[runId] = es
      es.onmessage = (evt) => {
        try {
          const event = JSON.parse(evt.data) as AgentEvent
          onMessage(event)
          if (
            event.event_type === 'agent_output' ||
            event.event_type === 'run_failed' ||
            event.event_type === 'run_cancelled'
          ) {
            try {
              es.close()
            } catch {
              /* noop */
            }
            delete sourcesRef.current[runId]
          }
        } catch (e) {
          console.error('Invalid SSE message', e)
        }
      }
      es.onerror = () => {
        try {
          es.close()
        } catch {
          /* noop */
        }
        delete sourcesRef.current[runId]
      }
    },
    [apiOrigin, onMessage]
  )

  const disconnect = useCallback((runId: string) => {
    const es = sourcesRef.current[runId]
    if (es) {
      try {
        es.close()
      } catch {
        /* noop */
      }
      delete sourcesRef.current[runId]
    }
  }, [])

  const isConnected = useCallback((runId: string) => {
    return Boolean(sourcesRef.current[runId])
  }, [])

  return { connect, resume, disconnect, isConnected } as const
}
