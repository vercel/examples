// POST /api/refund — refuses to refund until someone taps Approve on a phone.
// Replace `issueRefund` with your own payments call.
//
// Hobby plan functions stop at 10 s by default; the approval waits up to 25 s.
export const maxDuration = 30

const API = 'https://api.lauther.id'

async function issueRefund(orderId: string, amount: number) {
  // e.g. stripe.refunds.create({ payment_intent: …, amount })
  return { orderId, amount, refunded: true }
}

export async function POST(req: Request) {
  const { token: bodyToken, orderId, amount, email } = await req.json()
  const token = (bodyToken as string | undefined)?.trim() || process.env.LAUTHER_TOKEN
  if (!token) {
    return Response.json(
      { error: 'No token. Paste one from the Lauther app, or set LAUTHER_TOKEN.' },
      { status: 400 }
    )
  }

  const res = await fetch(`${API}/v1/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `Refund €${amount} to ${email}?`,
      message: `Order ${orderId}`,
      wait: 25,
      // Ask for a fingerprint; the answer then records that a person gave it.
      requireBiometric: true,
    }),
  })
  if (!res.ok) {
    const out = await res.json().catch(() => ({}))
    return Response.json(out, { status: res.status })
  }
  const { response } = await res.json()

  if (response === 'deny') return new Response('denied', { status: 403 })
  if (response !== 'approve') {
    // Nobody answered in time. The buttons stay live on the phone, but this
    // request is over — and silence is a stop, never a yes.
    return new Response('held for approval', { status: 202 })
  }

  return Response.json(await issueRefund(orderId, amount))
}
