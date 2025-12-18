'use client'

import { useCallback } from 'react'
import posthog from 'posthog-js'

export function EventTracker() {
  const trackEvent = useCallback((eventName: string) => {
    posthog.capture(eventName, {
      timestamp: new Date().toISOString(),
    })
  }, [])

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold">Test Event Tracking</h2>
      <p className="text-slate-400">
        Click the buttons below to trigger events. Check your PostHog dashboard to see them tracked through the proxy.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => trackEvent('button_clicked')}
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium"
        >
          Button Click
        </button>
        <button
          onClick={() => trackEvent('feature_explored')}
          className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-lg font-medium"
        >
          Feature Explored
        </button>
        <button
          onClick={() => trackEvent('api_called')}
          className="bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded-lg font-medium"
        >
          API Called
        </button>
        <button
          onClick={() => trackEvent('action_completed')}
          className="bg-orange-600 hover:bg-orange-700 transition-colors px-4 py-2 rounded-lg font-medium"
        >
          Action Completed
        </button>
      </div>
      <div className="mt-6 bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <p className="text-sm text-slate-400">
          <strong>Network insight:</strong> Open your browser's Network tab and filter for <code className="bg-slate-900 px-1.5 py-0.5 rounded text-xs">/ph</code> requests. You'll see all analytics calls going through your domain instead of directly to PostHog.
        </p>
      </div>
    </div>
  )
}

