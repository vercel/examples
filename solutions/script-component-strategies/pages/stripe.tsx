import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import { Code, Layout, List, Page, Text } from '@vercel/examples-ui'

interface Log {
  time: Date
  text: string
}

function StripeAfterInteractive() {
  const [log, setLog] = useState<Log[]>([])

  const addLog = useCallback(
    (text: string) => {
      setLog((log) => log.concat({ time: new Date(), text }))
    },
    [setLog]
  )

  useEffect(() => {
    addLog(`Page loaded window.Stripe is undefined`)
  }, [addLog])

  return (
    <>
      {/* We load the Stripe SDK afterInteractive */}
      <Script
        src="https://js.stripe.com/v3/"
        strategy="afterInteractive"
        onLoad={() =>
          addLog(`script loaded correctly, window.Stripe has been populated`)
        }
      />

      <Page>
        <section className="flex flex-col gap-6">
          <Text variant="h1">lazyOnload Stripe sdk</Text>
          <Text>
            You can check <Code>window.Stripe</Code> on browser console
          </Text>
          <List>
            {log.map(({ time, text }) => (
              <li key={+time}>
                <span className="font-medium">{time.toISOString()}</span>:{' '}
                {text}
              </li>
            ))}
          </List>
        </section>
      </Page>
    </>
  )
}

StripeAfterInteractive.Layout = Layout

export default StripeAfterInteractive
