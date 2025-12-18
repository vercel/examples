export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-4">PostHog Analytics Proxy</h1>
        <p className="text-lg text-slate-300 mb-6">
          This demo shows how to proxy PostHog analytics requests through Vercel to bypass ad blockers.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-blue-400">How it works</h2>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Requests to <code className="bg-slate-900 px-2 py-1 rounded">/ph/*</code> are proxied to PostHog</li>
              <li>• The host header is rewritten for proper routing</li>
              <li>• Analytics appear to come from your domain</li>
              <li>• Ad blockers don't filter domain-based requests</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-green-400">Benefits</h2>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>✓ Bypass ad blockers</li>
              <li>✓ Better data collection</li>
              <li>✓ No edge function costs</li>
              <li>✓ Works with any framework</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">vercel.ts Configuration</h2>
        <p className="text-slate-300 mb-4">
          The routing is configured in <code className="bg-slate-900 px-2 py-1 rounded">vercel.ts</code>:
        </p>
        <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm border border-slate-700">
          <code>{`routes: [
  routes.rewrite('/ph/static/(.*)', 
    'https://us-assets.i.posthog.com/static/$1',
    { requestHeaders: { 'host': 'us-assets.i.posthog.com' } }
  ),
  routes.rewrite('/ph/(.*)', 
    'https://us.i.posthog.com/$1',
    { requestHeaders: { 'host': 'us.i.posthog.com' } }
  ),
]`}</code>
        </pre>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">PostHog Initialization</h2>
        <p className="text-slate-300 mb-4">
          Initialize PostHog with the proxy path:
        </p>
        <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm border border-slate-700">
          <code>{`PostHog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: '/ph',
  ui_host: 'https://us.posthog.com',
})`}</code>
        </pre>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <p className="text-sm text-slate-300">
          👉 <strong>Tip:</strong> Click the buttons below to trigger events and see them tracked through the proxy.
        </p>
      </div>
    </div>
  )
}

