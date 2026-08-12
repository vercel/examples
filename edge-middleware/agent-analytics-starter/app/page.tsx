import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <span className="badge">agent-analytics starter</span>
      <h1>See the agents your JavaScript can&apos;t.</h1>
      <p className="muted">
        This page was just tracked. If your <code>NEXT_PUBLIC_POSTHOG_KEY</code>{' '}
        is set and an AI bot fetches it, you&apos;ll see a <code>doc_view</code>{' '}
        event land in PostHog within seconds — with <code>is_ai_bot: true</code>
        , the agent&apos;s UA, the path, and a stable anonymous distinct id.
      </p>

      <h2>Try it</h2>
      <p>Spoof a bot UA against this deployment and watch PostHog:</p>
      <pre>
        <code>{`# From the command line:
curl -A "ClaudeBot/1.0" https://<your-deployment>.vercel.app/

# Then in PostHog → Activity, filter events by:
#   event = doc_view  AND  is_ai_bot = true`}</code>
      </pre>

      <h2>Markdown mirror demo</h2>
      <p>
        The <code>/docs/</code> routes are served as Markdown when an agent asks
        (either via <code>Accept: text/markdown</code>, a <code>.md</code>{' '}
        suffix, or a known AI-bot user agent).
      </p>
      <ul>
        <li>
          <Link href="/docs/intro">/docs/intro</Link> — human view (HTML)
        </li>
        <li>
          <a href="/docs/intro.md">/docs/intro.md</a> — agent view (Markdown)
        </li>
      </ul>
      <pre>
        <code>{`# Same page, two representations:
curl https://<your-deployment>.vercel.app/docs/intro.md
curl -H "Accept: text/markdown" https://<your-deployment>.vercel.app/docs/intro
curl -A "ClaudeBot/1.0" https://<your-deployment>.vercel.app/docs/intro`}</code>
      </pre>

      <h2>What&apos;s in this template</h2>
      <ul>
        <li>
          <code>middleware.ts</code> — fires <code>trackDocView</code> on every
          Markdown serve, plus the full Markdown-mirror rewrite logic
        </li>
        <li>
          <code>public/md/docs/</code> — pre-built Markdown files served to
          agents
        </li>
        <li>
          <code>app/docs/[slug]/page.tsx</code> — human-facing rendering of the
          same content
        </li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li>
          Set <code>NEXT_PUBLIC_POSTHOG_KEY</code> in your Vercel project env
          vars
        </li>
        <li>
          Edit the <code>resolveMirrorPath</code> function in{' '}
          <code>middleware.ts</code> to cover your own content routes
        </li>
        <li>
          Add Markdown files to <code>public/md/</code> to match
        </li>
        <li>
          Browse the{' '}
          <a href="https://github.com/apideck-libraries/agent-analytics">
            @apideck/agent-analytics docs
          </a>{' '}
          for webhook / Mixpanel / Amplitude adapters
        </li>
      </ul>

      <footer>
        Built with{' '}
        <a href="https://github.com/apideck-libraries/agent-analytics">
          @apideck/agent-analytics
        </a>
        . MIT licensed.
      </footer>
    </main>
  )
}
