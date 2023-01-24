import { useEffect, useState } from 'react'
import { botDetect, useBotdReady } from '@lib/botd/script'

export default function BotdResult({ isBot }: { isBot?: boolean }) {
  const botdReady = useBotdReady()
  const [state, setState] = useState('')

  useEffect(() => {
    if (!botdReady) return

    const { userAgent } = window.navigator

    if (isBot) {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/90.0.4430.93 Safari/537.36',
        configurable: true,
      })
    }

    botDetect()
      .then((result) => {
        setState(JSON.stringify(result, null, 2))
      })
      .finally(() => {
        // Reset userAgent
        if (isBot) {
          Object.defineProperty(navigator, 'userAgent', {
            value: userAgent,
            configurable: true,
          })
        }
      })
  }, [botdReady])

  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 mb-4">
      {state}
    </pre>
  )
}
