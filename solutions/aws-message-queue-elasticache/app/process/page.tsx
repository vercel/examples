'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { StreamMessage } from '../api/messages/helpers'
import { getErrorMessage } from '../api/messages/helpers'

type ResultStatus =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }
  | { status: 'info'; message: string }

export default function ProcessPage() {
  const [currentMessage, setCurrentMessage] = useState<StreamMessage | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [showNextButton, setShowNextButton] = useState(false)
  const [result, setResult] = useState<ResultStatus>({ status: 'idle' })

  const fetchNextMessage = useCallback(async (resetState = true) => {
    if (resetState) {
      setIsLoading(true)
      setResult({ status: 'idle' })
      setShowNextButton(false)
    }

    try {
      const response = await fetch('/api/messages')
      const data = await response.json()

      if (response.ok) {
        if (data.message) {
          setCurrentMessage(data.message)
        } else {
          setCurrentMessage(null)
          setResult({ status: 'info', message: 'No messages in queue' })
        }
      } else {
        setResult({
          status: 'error',
          message: data.error || 'Failed to fetch message',
        })
        setCurrentMessage(null)
      }
    } catch (error: unknown) {
      setResult({ status: 'error', message: getErrorMessage(error) })
      setCurrentMessage(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAcknowledge = async () => {
    if (!currentMessage) return

    setIsLoading(true)
    setResult({ status: 'idle' })

    try {
      const response = await fetch(
        `/api/messages?messageId=${encodeURIComponent(
          currentMessage.streamMessageId
        )}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({
          status: 'success',
          message: 'Message acknowledged and removed from queue',
        })
        setCurrentMessage(null)
        setShowNextButton(true)
      } else {
        setResult({
          status: 'error',
          message: data.error || 'Failed to acknowledge message',
        })
      }
    } catch (error: unknown) {
      setResult({ status: 'error', message: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load the first queue item after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNextMessage(false)
  }, [fetchNextMessage])

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Message Processing Queue</h1>
        <Link
          href="/"
          className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          ← Back to Contact Form
        </Link>
      </div>

      <p className="text-gray-500 mb-8">
        Process messages from the queue one at a time. Click
        &quot;Acknowledge&quot; to mark a message as processed.
      </p>

      {isLoading && !currentMessage && !showNextButton && (
        <div className="py-10 text-center text-gray-500">Loading...</div>
      )}

      {!isLoading && !currentMessage && !showNextButton && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <p className="text-lg text-gray-500 mb-2">📭 No messages in queue</p>
          <p className="text-sm text-gray-400">
            Messages submitted via the contact form will appear here
          </p>
        </div>
      )}

      {currentMessage && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-5">
          {currentMessage.claimed && (
            <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              ⚠️ This message was recovered from pending list (idle &gt; 60s)
            </div>
          )}

          <div className="mb-4">
            <span className="block text-xs font-medium uppercase text-gray-400 mb-1">
              Message ID
            </span>
            <code className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {currentMessage.streamMessageId}
            </code>
          </div>

          <div className="mb-4">
            <span className="block text-xs font-medium uppercase text-gray-400 mb-1">
              Name
            </span>
            <div className="text-sm text-gray-900">{currentMessage.name}</div>
          </div>

          <div className="mb-4">
            <span className="block text-xs font-medium uppercase text-gray-400 mb-1">
              Email
            </span>
            <div className="text-sm text-gray-900">{currentMessage.email}</div>
          </div>

          <div className="mb-4">
            <span className="block text-xs font-medium uppercase text-gray-400 mb-1">
              Message
            </span>
            <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-gray-800">
              {currentMessage.message}
            </div>
          </div>

          <div className="mb-6">
            <span className="block text-xs font-medium uppercase text-gray-400 mb-1">
              Timestamp
            </span>
            <div className="text-sm text-gray-500">
              {new Date(currentMessage.timestamp).toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={isLoading}
            className="rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLoading ? 'Processing...' : '✓ Acknowledge'}
          </button>
        </div>
      )}

      {showNextButton && (
        <div className="py-10 text-center">
          <p className="text-gray-500 mb-4">Message processed successfully!</p>
          <button
            onClick={() => void fetchNextMessage()}
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Message →
          </button>
        </div>
      )}

      {result.status !== 'idle' && (
        <div
          className={`mt-5 rounded-md border p-3 text-sm ${
            result.status === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : result.status === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-gray-200 bg-gray-50 text-gray-600'
          }`}
        >
          {result.status === 'success' && '✓ '}
          {result.status === 'error' && '✗ '}
          {result.message}
        </div>
      )}
    </div>
  )
}
