export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <h1 className="text-xl font-bold">PostHog Proxy</h1>
        </div>
        <a
          href="https://posthog.com/docs/advanced/proxy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Documentation →
        </a>
      </div>
    </header>
  )
}

