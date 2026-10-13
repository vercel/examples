'use client'

import { useState } from 'react'
import { Page, Text, Code, Link, Button } from '@vercel/examples-ui'

interface StreamEvent {
  type: 'meta' | 'chunk' | 'done' | 'error'
  totalChunks?: number
  text?: string
  message?: string
}

export default function Home() {
  const [output, setOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(
    'Streaming responses give users instant feedback. They make slow APIs feel fast.',
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (streaming) return

    setStreaming(true)
    setOutput('')
    setError(null)
    setProgress(null)

    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!response.body) throw new Error('No response body to stream')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let received = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        let newlineIdx = buffer.indexOf('\n')
        while (newlineIdx !== -1) {
          const line = buffer.slice(0, newlineIdx).trim()
          buffer = buffer.slice(newlineIdx + 1)

          if (line) {
            try {
              const event = JSON.parse(line) as StreamEvent
              if (event.type === 'meta' && event.totalChunks) {
                setProgress({ current: 0, total: event.totalChunks })
              } else if (event.type === 'chunk' && event.text) {
                received += 1
                setOutput((prev) => prev + event.text)
                setProgress((prev) =>
                  prev ? { ...prev, current: received } : null,
                )
              } else if (event.type === 'error') {
                throw new Error(event.message || 'Stream error')
              }
            } catch (parseErr) {
              if (parseErr instanceof SyntaxError) {
                console.warn('Invalid NDJSON line:', line)
              } else {
                throw parseErr
              }
            }
          }

          newlineIdx = buffer.indexOf('\n')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setStreaming(false)
    }
  }

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">AI Streaming with NDJSON</Text>
        <Text>
          Progressive token-by-token streaming from a Next.js Route Handler using{' '}
          <Code>application/x-ndjson</Code> over a <Code>ReadableStream</Code>.
        </Text>
        <Text>
          NDJSON is a simpler alternative to Server-Sent Events when you need to{' '}
          <Code>POST</Code> a request body — which <Code>EventSource</Code> can&apos;t do.
          The demo below sends your prompt to the server, which streams back one chunk
          per word so you can see the response build progressively.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Try it</Text>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <Text className="text-sm font-medium">Prompt to echo back chunk-by-chunk:</Text>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={streaming}
              rows={3}
              className="w-full rounded-md border border-accents-3 bg-background px-3 py-2 font-mono text-sm focus:border-accents-5 focus:outline-none disabled:opacity-50"
            />
          </label>
          <Button type="submit" disabled={streaming || !prompt.trim()}>
            {streaming ? 'Streaming…' : 'Start streaming'}
          </Button>
        </form>

        {progress && (
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-accents-2">
              <div
                className="h-full bg-accents-6 transition-all duration-100"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <Text className="font-mono text-xs text-accents-5">
              {progress.current} / {progress.total} chunks
            </Text>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-error/30 bg-error/10 p-3 text-sm text-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {output && (
          <div className="rounded-md border border-accents-3 bg-accents-1 p-4 font-mono text-sm leading-relaxed">
            {output}
            {streaming && (
              <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-accents-6 align-middle" />
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">How it works</Text>
        <Text>
          Read the{' '}
          <Link href="https://github.com/vercel/examples/tree/main/solutions/ai-streaming-ndjson#how-it-works">
            README
          </Link>{' '}
          for the full breakdown. The short version:
        </Text>
        <ul className="ml-6 list-disc space-y-2 text-sm">
          <li>
            <Code>app/api/stream/route.ts</Code> returns a <Code>ReadableStream</Code> that
            encodes each event as <Code>JSON + &quot;\n&quot;</Code>.
          </li>
          <li>
            The client uses <Code>response.body.getReader()</Code> +{' '}
            <Code>TextDecoder</Code> to read chunks, buffers across newline boundaries,
            and parses one JSON event per line.
          </li>
          <li>
            <Code>X-Accel-Buffering: no</Code> tells proxies not to buffer — Vercel
            respects this automatically.
          </li>
        </ul>
      </section>
    </Page>
  )
}
