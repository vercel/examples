'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(
          `✓ Message submitted successfully! (ID: ${data.streamMessageId})`
        )
        // Clear form
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setResult(`✗ Error: ${data.error || 'Failed to submit message'}`)
      }
    } catch (error) {
      setResult(`✗ Error: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>Contact Form</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Submit a message to the queue. Messages are processed in order by
        reviewers.
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="name"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="message"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            required
            rows={5}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            backgroundColor: isSubmitting ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Message'}
        </button>
      </form>

      {result && (
        <div
          style={{
            padding: '12px',
            backgroundColor: result.startsWith('✓') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${
              result.startsWith('✓') ? '#c3e6cb' : '#f5c6cb'
            }`,
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          {result}
        </div>
      )}

      <hr
        style={{
          margin: '30px 0',
          border: 'none',
          borderTop: '1px solid #ddd',
        }}
      />

      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '10px', color: '#666' }}>
          Are you a reviewer? Process queued messages:
        </p>
        <Link
          href="/process"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            textDecoration: 'none',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          → Go to Processing View
        </Link>
      </div>
    </div>
  )
}
