import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import { Code, Layout, List, Page, Text } from '@vercel/examples-ui'

interface Log {
  time: Date
  text: string
}

function FBLazyLoad() {
  const [log, setLog] = useState<Log[]>([])

  const addLog = useCallback(
    (text: string) => {
      setLog((log) => log.concat({ time: new Date(), text }))
    },
    [setLog]
  )

  useEffect(() => {
    addLog(`Page loaded window.FB is undefined`)
  }, [addLog])

  return (
    <>
      {/* We lazy load the FB SDK */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          addLog(`script loaded correctly, window.FB has been populated`)
        }
      />

      <Page>
        <section className="flex flex-col gap-6">
          <Text variant="h1">lazyOnload FB sdk</Text>
          <Text>
            You can check <Code>window.FB</Code> on browser console
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

FBLazyLoad.Layout = Layout

export default FBLazyLoad
