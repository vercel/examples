'use client'

import { useState } from 'react'
import { Page, Text, Code, Link, Button, Input } from '@vercel/examples-ui'

type Outcome = { label: string; detail: string } | null

export default function Home() {
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState<'notify' | 'refund' | null>(null)
  const [outcome, setOutcome] = useState<Outcome>(null)

  async function call(path: 'notify' | 'refund') {
    setBusy(path)
    setOutcome(null)
    try {
      const res = await fetch(`/api/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          path === 'notify'
            ? { token, title: 'New signup', message: 'anna@example.com · plan: free' }
            : { token, orderId: '1042', amount: 49, email: 'anna@example.com' }
        ),
      })
      const data = await res.json().catch(() => ({}))
      if (path === 'notify') {
        setOutcome(
          res.ok
            ? { label: 'Delivered', detail: 'Check your phone.' }
            : { label: `HTTP ${res.status}`, detail: data.error ?? 'Something went wrong.' }
        )
      } else if (res.status === 200) {
        setOutcome({ label: 'Approved', detail: 'You tapped Approve, so the refund ran.' })
      } else if (res.status === 403) {
        setOutcome({ label: 'Denied', detail: 'You tapped Deny. Nothing happened.' })
      } else if (res.status === 202) {
        setOutcome({
          label: 'No answer',
          detail: 'Nobody tapped in 25 s, so nothing happened. Silence is a stop, not a yes.',
        })
      } else {
        setOutcome({ label: `HTTP ${res.status}`, detail: data.error ?? 'Something went wrong.' })
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Native notifications for web apps</Text>
        <Text>
          A web app ends when the tab closes. This example is the bridge to the
          other side: one HTTP call from a route handler becomes a{' '}
          <b>native notification</b> on a phone — with a tap target, a priority,
          and the option to ask a question and get the answer back. No native
          app to ship, no push certificate, no SDK.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Try it on your own phone</Text>
        <Text>
          Install{' '}
          <Link href="https://lauther.app/get.html">Lauther</Link> (free), mint a
          token in the app under <b>Apps → ＋ → New token</b>, and paste it here.
          The token is used for this one request and is not stored. Leave it
          empty and the server uses its own <Code>LAUTHER_TOKEN</Code>.
        </Text>
        <Input
          placeholder="lpt_…"
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
          className="font-mono"
        />
        <div className="flex gap-3">
          <Button onClick={() => call('notify')} disabled={busy !== null}>
            {busy === 'notify' ? 'Sending…' : 'Notify my phone'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => call('refund')}
            disabled={busy !== null}
          >
            {busy === 'refund' ? 'Waiting for your tap…' : 'Ask my phone a question'}
          </Button>
        </div>
        {outcome && (
          <Text>
            <b>{outcome.label}.</b> {outcome.detail}
          </Text>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">What crosses the bridge</Text>
        <Text>
          <Code>/api/notify</Code> — <Code>POST /v1/push</Code>. A title, a
          message, an optional <Code>url</Code> so the tap lands on your own page,
          and a <Code>priority</Code> for the ones that should cross quiet hours.
        </Text>
        <Text>
          <Code>/api/refund</Code> — <Code>POST /v1/approve</Code>. The same
          notification with Approve and Deny on it; the route blocks up to 25 s
          for the tap. <Code>approve</Code> proceeds, <Code>deny</Code> returns 403,
          no answer returns 202 and does nothing. Add{' '}
          <Code>requireBiometric</Code> and the answer records a fingerprint.
        </Text>
        <Text>
          The same API also does passwordless sign-in (a QR code instead of a
          password field) and topics for broadcasting to many phones at once —
          see the{' '}
          <Link href="https://lauther.app/docs.html">docs</Link>.
        </Text>
        <Text>
          One Vercel detail: the Hobby plan caps a function at 10 s by default,
          so the refund route sets <Code>export const maxDuration = 30</Code>.
        </Text>
      </section>
    </Page>
  )
}
