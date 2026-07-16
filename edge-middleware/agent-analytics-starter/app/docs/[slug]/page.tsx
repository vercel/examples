import Link from 'next/link'
import { notFound } from 'next/navigation'

const DOCS: Record<string, { title: string; intro: string }> = {
  intro: {
    title: 'Intro',
    intro:
      'This page is served as HTML for browsers, and as clean Markdown for AI agents. The switch happens in middleware.ts — no framework changes, no JSX-in-Markdown dance.',
  },
  usage: {
    title: 'Usage',
    intro:
      'Spoof any of ClaudeBot, GPTBot, PerplexityBot, Google-Extended, Applebot-Extended, Cursor, or Windsurf as the User-Agent and you\u2019ll receive the Markdown mirror. A `doc_view` event fires into PostHog on every Markdown fetch.',
  },
}

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }))
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = DOCS[slug]
  if (!doc) notFound()

  return (
    <main>
      <p className="muted">
        <Link href="/">← Back</Link>
      </p>
      <span className="badge">human view (HTML)</span>
      <h1>{doc.title}</h1>
      <p>{doc.intro}</p>

      <h2>See the agent view</h2>
      <p>
        Same URL, append <code>.md</code> or send{' '}
        <code>Accept: text/markdown</code>:
      </p>
      <pre>
        <code>{`curl /docs/${slug}.md
curl -H "Accept: text/markdown" /docs/${slug}
curl -A "ClaudeBot/1.0" /docs/${slug}`}</code>
      </pre>

      <p>
        The agent gets the pre-built Markdown in{' '}
        <code>public/md/docs/{slug}.md</code>, with{' '}
        <code>Content-Type: text/markdown</code>, <code>Content-Signal</code>,
        and <code>x-markdown-tokens</code> headers. A <code>doc_view</code>{' '}
        event is captured in PostHog with <code>source</code> ={' '}
        <code>md-suffix</code>, <code>accept-header</code>, or{' '}
        <code>ua-rewrite</code> depending on how the agent arrived.
      </p>

      <footer>
        Edit <code>app/docs/[slug]/page.tsx</code> to customize this template,
        and <code>public/md/docs/*.md</code> to change what agents see.
      </footer>
    </main>
  )
}
