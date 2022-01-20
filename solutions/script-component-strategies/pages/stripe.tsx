import { useMemo, useState } from 'react'
import Script from 'next/script'
import { Layout, List, Page, Text } from '@vercel/examples-ui'

function Stripe() {
  const [stripe, setStripe] = useState(null)
  const methods = useMemo(
    () =>
      stripe
        ? Object.entries(stripe).filter(([_key, value]) => typeof value === 'function')
        : [],
    [stripe]
  )

  return (
    <Page>
      {/* We load Stripe sdk afterInteractive */}
      <Script
        id="stripe-js"
        src="https://js.stripe.com/v3/"
        onLoad={() => setStripe((window as any).Stripe('pk_test_1234'))}
      />

      <main className="flex flex-col gap-6">
        <Text variant="h1">afterInteractive Stripe demo</Text>
        {stripe ? (
        <section className="flex flex-col gap-2">
          <Text>Stripe instance methods: </Text>
          <List>
            {methods.map(([method]) => (
              <li key={method}>{method}</li>
            ))}
          </List>
        </section>
        ) : <Text>Loading...</Text>}
      </main>
    </Page>
  )
}

Stripe.Layout = Layout;

export default Stripe;