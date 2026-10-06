'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

type Consumer = 'nextjs' | 'python'

type Demo = {
  title: string
  description: string
  producer: 'Next.js' | 'Python'
  topic: string
  expectedConsumers: Consumer[]
  endpoint: string
}

type Completion = {
  result: {
    received: { text?: string }
  }
}

type TaskResult = {
  taskId: string
  messageId: string | null
  status: 'pending' | 'completed' | 'error'
  expectedConsumers: Consumer[]
  completions: Record<string, Completion>
  detail?: string
}

type ActiveRun = {
  title: string
  expectedConsumers: Consumer[]
  taskId?: string
  messageId?: string | null
}

const demos: Demo[] = [
  {
    title: 'Next.js → Python',
    description: 'Send in Next.js, consume in Python.',
    producer: 'Next.js',
    topic: 'demo-next-to-python',
    expectedConsumers: ['python'],
    endpoint: '/api/next/next-to-python',
  },
  {
    title: 'Python → Next.js',
    description: 'Send in Python, consume in Next.js.',
    producer: 'Python',
    topic: 'demo-python-to-next',
    expectedConsumers: ['nextjs'],
    endpoint: '/api/python/messages/python-to-next',
  },
  {
    title: 'Fan out',
    description: 'Send once, consume in both runtimes.',
    producer: 'Next.js',
    topic: 'demo-fanout',
    expectedConsumers: ['nextjs', 'python'],
    endpoint: '/api/next/fanout',
  },
]

export default function Home() {
  const [pending, setPending] = useState<string>()
  const [activeRun, setActiveRun] = useState<ActiveRun>()
  const [results, setResults] = useState<Record<string, TaskResult>>({})
  const runIds = useRef<Record<string, string>>({})

  async function pollTask(
    title: string,
    taskId: string,
    runId: string,
    attempt = 0
  ) {
    if (runIds.current[title] !== runId) return

    try {
      const response = await fetch(
        `/api/python/tasks/${encodeURIComponent(taskId)}`,
        { cache: 'no-store' }
      )
      if (!response.ok) {
        throw new Error(`Result lookup failed (${response.status})`)
      }

      const task = (await response.json()) as TaskResult
      if (runIds.current[title] !== runId) return
      setResults((current) => ({ ...current, [title]: task }))

      if (task.status !== 'completed' && attempt < 120) {
        window.setTimeout(
          () => pollTask(title, taskId, runId, attempt + 1),
          1000
        )
      }
    } catch (error) {
      if (runIds.current[title] !== runId) return
      setResults((current) => ({
        ...current,
        [title]: {
          ...current[title],
          taskId,
          status: 'error',
          expectedConsumers: current[title]?.expectedConsumers ?? [],
          completions: current[title]?.completions ?? {},
          messageId: current[title]?.messageId ?? null,
          detail:
            error instanceof Error ? error.message : 'Unable to read result',
        },
      }))
    }
  }

  async function enqueue(demo: Demo) {
    const runId = crypto.randomUUID()
    runIds.current[demo.title] = runId
    setPending(demo.title)
    setActiveRun({
      title: demo.title,
      expectedConsumers: demo.expectedConsumers,
    })
    setResults((current) => {
      const next = { ...current }
      delete next[demo.title]
      return next
    })

    try {
      const response = await fetch(demo.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `Hello from ${demo.producer}`,
          sentAt: new Date().toISOString(),
        }),
      })
      const result = (await response.json()) as {
        taskId?: string
        messageId?: string | null
        detail?: string
        expectedConsumers?: Consumer[]
      }

      if (!response.ok) {
        throw new Error(result.detail ?? `Request failed (${response.status})`)
      }
      if (!result.taskId) {
        throw new Error('Producer did not return a task ID')
      }
      if (!result.expectedConsumers) {
        throw new Error('Producer did not return expected consumers')
      }
      const taskId = result.taskId
      const expectedConsumers = result.expectedConsumers
      setActiveRun((current) =>
        current?.title === demo.title
          ? {
              ...current,
              taskId,
              messageId: result.messageId ?? null,
            }
          : current
      )

      setResults((current) => ({
        ...current,
        [demo.title]: {
          taskId,
          messageId: result.messageId ?? null,
          status: 'pending',
          expectedConsumers,
          completions: {},
        },
      }))
      void pollTask(demo.title, taskId, runId)
    } catch (error) {
      setResults((current) => ({
        ...current,
        [demo.title]: {
          taskId: '',
          messageId: null,
          status: 'error',
          expectedConsumers: demo.expectedConsumers,
          completions: {},
          detail:
            error instanceof Error
              ? error.message
              : 'Unable to enqueue message',
        },
      }))
    } finally {
      setPending(undefined)
    }
  }

  const activeTask = activeRun ? results[activeRun.title] : undefined

  function runtimeState(runtime: Consumer) {
    if (!activeRun?.expectedConsumers.includes(runtime)) return 'idle'
    if (!activeTask) return 'processing'
    if (activeTask.completions[runtime]) return 'completed'
    if (activeTask.status === 'error') return 'error'
    return 'processing'
  }

  return (
    <main>
      <header className="hero">
        <h1>Next.js + Python queues</h1>
        <p>Send a message and watch each consumer run.</p>
      </header>

      <section className="demo-grid" aria-label="Queue demos">
        {demos.map((demo, index) => (
          <article
            className={`demo-card ${
              activeRun?.title === demo.title ? 'selected' : ''
            }`}
            key={demo.title}
          >
            <div className="card-topline">
              <span>0{index + 1}</span>
              <span>{demo.producer}</span>
            </div>
            <div className="card-copy">
              <h2>{demo.title}</h2>
              <p>{demo.description}</p>
            </div>
            <div className="mini-code">
              <div className="code-chrome">
                <span>
                  {demo.producer === 'Python' ? 'main.py' : 'route.ts'}
                </span>
                <span>{demo.topic}</span>
              </div>
              <pre>
                <code>
                  <span className="syntax-keyword">await</span>{' '}
                  <span className="syntax-fn">send</span>
                  (&quot;{demo.topic}&quot;, payload)
                </code>
              </pre>
            </div>
            <button
              disabled={pending !== undefined}
              onClick={() => enqueue(demo)}
              type="button"
            >
              <span>
                {pending === demo.title ? 'Sending…' : 'Send message'}
              </span>
              <span aria-hidden="true">→</span>
            </button>
            <output aria-live="polite" className="task-output">
              {results[demo.title] && (
                <>
                  <div className="task-state">
                    <span
                      className={`status-dot ${results[demo.title].status}`}
                    />
                    {results[demo.title].status}
                  </div>
                  {results[demo.title].detail && (
                    <span>{results[demo.title].detail}</span>
                  )}
                </>
              )}
            </output>
          </article>
        ))}
      </section>

      <section className="consumers-section" aria-labelledby="consumers-title">
        <div className="section-heading">
          <h2 id="consumers-title">Consumers</h2>
        </div>

        <div className="handler-grid">
          <article className="handler-card" data-state={runtimeState('nextjs')}>
            <div className="handler-header">
              <div>
                <span className="runtime-icon">
                  <Image alt="" height={22} src="/nextjs.svg" width={22} />
                </span>
                <div>
                  <strong>Next.js callback</strong>
                  <small>route.ts</small>
                </div>
              </div>
              <span className="handler-state">
                <i />
                {runtimeState('nextjs')}
              </span>
            </div>
            <pre className="handler-code">
              <code>
                <span className="syntax-keyword">export const</span> POST ={' '}
                <span className="syntax-fn">handleCallback</span>(
                <span className="syntax-keyword">async</span> (message) =&gt;{' '}
                {'{'}
                {'\n  '}
                <span className="syntax-keyword">await</span>{' '}
                <span className="syntax-fn">completeTask</span>(message)
                {'\n'}
                {'}'})
              </code>
            </pre>
            <div className="handler-result">
              <span>Latest result</span>
              <code>
                {activeTask?.completions.nextjs?.result.received.text ??
                  'Waiting for a delivery…'}
              </code>
            </div>
          </article>

          <article className="handler-card" data-state={runtimeState('python')}>
            <div className="handler-header">
              <div>
                <span className="runtime-icon">
                  <Image alt="" height={22} src="/python.svg" width={22} />
                </span>
                <div>
                  <strong>Python subscriber</strong>
                  <small>subscribers.py</small>
                </div>
              </div>
              <span className="handler-state">
                <i />
                {runtimeState('python')}
              </span>
            </div>
            <pre className="handler-code">
              <code>
                <span className="syntax-decorator">@subscribe</span>
                (topic=<span className="syntax-string">&quot;demo-*&quot;</span>
                ){'\n'}
                <span className="syntax-keyword">async def</span>{' '}
                <span className="syntax-fn">handle</span>(message):
                {'\n  '}
                <span className="syntax-keyword">await</span>{' '}
                <span className="syntax-fn">complete_task</span>(message)
              </code>
            </pre>
            <div className="handler-result">
              <span>Latest result</span>
              <code>
                {activeTask?.completions.python?.result.received.text ??
                  'Waiting for a delivery…'}
              </code>
            </div>
          </article>
        </div>

        {activeRun && (
          <div className="run-meta">
            <span>Current task</span>
            <code>{activeRun.taskId ?? 'Creating task…'}</code>
            <span>
              {activeRun.taskId
                ? activeRun.messageId ?? 'ingestion deferred'
                : ' '}
            </span>
          </div>
        )}
      </section>
    </main>
  )
}
