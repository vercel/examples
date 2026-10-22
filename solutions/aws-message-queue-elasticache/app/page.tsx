'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getErrorMessage } from './api/messages/helpers'

type FormStatus =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<FormStatus>({ status: 'idle' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult({ status: 'idle' })

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          status: 'success',
          message: `Message submitted successfully! (ID: ${data.streamMessageId})`,
        })
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setResult({
          status: 'error',
          message: data.error || 'Failed to submit message',
        })
      }
    } catch (error: unknown) {
      setResult({ status: 'error', message: getErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Contact Form</h1>
      <p className="text-gray-500 mb-6">
        Submit a message to the queue. Messages are processed in order by
        reviewers.
      </p>

      <form onSubmit={handleSubmit} className="mb-8 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              e.target.setCustomValidity('')
            }}
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                'Please enter your name'
              )
            }
            placeholder="Enter your name"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              e.target.setCustomValidity('')
            }}
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                'Please enter a valid email address'
              )
            }
            placeholder="Enter your email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              e.target.setCustomValidity('')
            }}
            onInvalid={(e) =>
              (e.target as HTMLTextAreaElement).setCustomValidity(
                'Please enter your message'
              )
            }
            placeholder="Enter your message"
            required
            rows={5}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Message'}
        </button>
      </form>

      {result.status !== 'idle' && (
        <div
          className={`rounded-md border p-3 mb-5 text-sm ${
            result.status === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {result.status === 'success' ? '✓' : '✗'} {result.message}
        </div>
      )}

      <hr className="my-8 border-t border-gray-200" />

      <div className="text-center">
        <p className="text-gray-500 mb-3 text-sm">
          Are you a reviewer? Process queued messages:
        </p>
        <Link
          href="/process"
          className="inline-block rounded-md border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          → Go to Processing View
        </Link>
      </div>
    </div>
  )
}
