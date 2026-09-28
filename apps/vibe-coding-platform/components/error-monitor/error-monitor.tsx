'use client'

import { type Line } from './schemas'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useTransition,
} from 'react'
import { getSummary } from './get-summary'
import { useCommandErrorsLogs } from '@/app/state'
import { useMonitorState } from './state'
import { useSettings } from '@/components/settings/use-settings'
import { useSharedChatContext } from '@/lib/chat-context'
import { toast } from 'sonner'

interface Props {
  children: React.ReactNode
  debounceTimeMs?: number
}

export function ErrorMonitor({ children, debounceTimeMs = 10000 }: Props) {
  const [pending, startTransition] = useTransition()
  const { cursor, scheduled, setCursor, setScheduled } = useMonitorState()
  const { errors } = useCommandErrorsLogs()
  const { fixErrors } = useSettings()
  const {
    send,
    status: chatStatus,
    data: { messages },
  } = useSharedChatContext()
  const submitTimeout = useRef<NodeJS.Timeout | null>(null)
  const inspectedErrors = useRef<number>(0)
  const lastReportedErrors = useRef<string[]>([])
  const errorReportCount = useRef<Map<string, number>>(new Map())
  const lastErrorReportTime = useRef<number>(0)
  const mounted = useRef(false)
  const clearSubmitTimeout = useCallback(() => {
    if (submitTimeout.current) {
      setScheduled(false)
      clearTimeout(submitTimeout.current)
      submitTimeout.current = null
    }
  }, [setScheduled])

  useEffect(() => {
    mounted.current = true
    setCursor(0)
    return () => {
      mounted.current = false
      clearSubmitTimeout()
    }
  }, [clearSubmitTimeout, setCursor])

  const status =
    chatStatus !== 'ready' || fixErrors === false
      ? 'disabled'
      : pending || scheduled
        ? 'pending'
        : 'ready'

  const getErrorKey = (error: Line) => {
    return `${error.command}-${error.args.join(' ')}-${error.data.slice(
      0,
      100
    )}`
  }

  const handleErrors = (errors: Line[], prev: Line[]) => {
    const now = Date.now()
    const timeSinceLastReport = now - lastErrorReportTime.current

    if (timeSinceLastReport < 60000) {
      return
    }

    const errorKeys = errors.map(getErrorKey)
    const uniqueErrorKeys = [...new Set(errorKeys)]

    const newErrors = uniqueErrorKeys.filter((key) => {
      const count = errorReportCount.current.get(key) || 0
      return count < 1
    })

    if (newErrors.length === 0) {
      return
    }

    startTransition(async () => {
      try {
        const summary = await getSummary(errors, prev)
        if (mounted.current && summary.shouldBeFixed) {
          newErrors.forEach((key) => {
            errorReportCount.current.set(key, 1)
          })

          lastReportedErrors.current = newErrors
          lastErrorReportTime.current = Date.now()

          await send(
            `Fix the following preview errors with targeted changes:\n${summary.summary}\nFiles: ${summary.paths?.join(', ') ?? 'unknown'}`
          )
        }
      } catch (error) {
        if (mounted.current)
          toast.error(
            error instanceof Error
              ? error.message
              : 'Could not inspect preview errors'
          )
      }
    })
  }

  useEffect(() => {
    if (messages.length === 0) {
      errorReportCount.current.clear()
      lastReportedErrors.current = []
      lastErrorReportTime.current = 0
    }
  }, [messages.length])

  useEffect(() => {
    if (status === 'ready' && inspectedErrors.current < errors.length) {
      const prev = errors.slice(0, cursor)
      const pending = errors.slice(cursor)
      inspectedErrors.current = errors.length
      setScheduled(true)
      clearSubmitTimeout()
      submitTimeout.current = setTimeout(() => {
        setScheduled(false)
        setCursor(errors.length)
        handleErrors(pending, prev)
      }, debounceTimeMs)
    } else if (status === 'disabled') {
      clearSubmitTimeout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This is fine
  }, [clearSubmitTimeout, cursor, errors, status])

  return <Context.Provider value={{ status }}>{children}</Context.Provider>
}

const Context = createContext<{
  status: 'ready' | 'pending' | 'disabled'
} | null>(null)

export function useErrorMonitor() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useErrorMonitor must be used within a ErrorMonitor')
  }
  return context
}
