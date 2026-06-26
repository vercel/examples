'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { StreamMessage } from '../api/messages/helpers'
import { getErrorMessage } from '../api/messages/helpers'

type ResultStatus = { status: 'idle' } | { status: 'success'; message: string } | { status: 'error'; message: string } | { status: 'info'; message: string }

export default function ProcessPage() {
  const [currentMessage, setCurrentMessage] = useState<StreamMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNextButton, setShowNextButton] = useState(false)
  const [result, setResult] = useState<ResultStatus>({ status: 'idle' })

  const fetchNextMessage = async () => {
    setIsLoading(true)
    setResult({ status: 'idle' })
    setShowNextButton(false)

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
        setResult({ status: 'error', message: data.error || 'Failed to fetch message' })
        setCurrentMessage(null)
      }
    } catch (error: unknown) {
      setResult({ status: 'error', message: getErrorMessage(error) })
      setCurrentMessage(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcknowledge = async () => {
    if (!currentMessage) return

    setIsLoading(true)
    setResult({ status: 'idle' })

    try {
      const response = await fetch(
        `/api/messages?messageId=${encodeURIComponent(currentMessage.streamMessageId)}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({ status: 'success', message: 'Message acknowledged and removed from queue' })
        setCurrentMessage(null)
        setShowNextButton(true)
      } else {
        setResult({ status: 'error', message: data.error || 'Failed to acknowledge message' })
      }
    } catch (error: unknown) {
      setResult({ status: 'error', message: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNextMessage()
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Message Processing Queue</h1>
        <Link
          href="/"
          style={{
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            textDecoration: 'none',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          ← Back to Contact Form
        </Link>
      </div>

      <p style={{ marginBottom: '30px', color: '#666' }}>
        Process messages from the queue one at a time. Click
        &quot;Acknowledge&quot; to mark a message as processed.
      </p>

      {isLoading && !currentMessage && !showNextButton && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Loading...
        </div>
      )}

      {!isLoading && !currentMessage && !showNextButton && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '2px dashed #ddd',
          }}
        >
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
            📭 No messages in queue
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Messages submitted via the contact form will appear here
          </p>
        </div>
      )}

      {currentMessage && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fff',
            marginBottom: '20px',
          }}
        >
          {currentMessage.claimed && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '14px',
              }}
            >
              ⚠️ This message was recovered from pending list (idle &gt; 60s)
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Message ID:
            </strong>
            <code
              style={{
                fontSize: '12px',
                backgroundColor: '#f5f5f5',
                padding: '2px 6px',
                borderRadius: '3px',
              }}
            >
              {currentMessage.streamMessageId}
            </code>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Name:
            </strong>
            <div>{currentMessage.name}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Email:
            </strong>
            <div>{currentMessage.email}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Message:
            </strong>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
              }}
            >
              {currentMessage.message}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Timestamp:
            </strong>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {new Date(currentMessage.timestamp).toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'Processing...' : '✓ Acknowledge'}
          </button>
        </div>
      )}

      {showNextButton && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Message processed successfully!
          </p>
          <button
            onClick={fetchNextMessage}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Next Message →
          </button>
        </div>
      )}

      {result.status !== 'idle' && (
        <div
          style={{
            padding: '12px',
            backgroundColor: result.status === 'success'
              ? '#d4edda'
              : result.status === 'error'
              ? '#f8d7da'
              : '#f5f5f5',
            border: `1px solid ${
              result.status === 'success'
                ? '#c3e6cb'
                : result.status === 'error'
                ? '#f5c6cb'
                : '#ddd'
            }`,
            borderRadius: '4px',
            marginTop: '20px',
          }}
        >
          {result.status === 'success' && '✓ '}{result.status === 'error' && '✗ '}{result.message}
        </div>
      )}
    </div>
  )
}
