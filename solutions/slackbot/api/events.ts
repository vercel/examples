import crypto from 'crypto'
import { sendGPTResponse } from './_chat'

export const config = {
  maxDuration: 30,
}

const signingSecret = process.env.SLACK_SIGNING_SECRET!

// See https://api.slack.com/authentication/verifying-requests-from-slack
async function isValidSlackRequest(request: Request, body: any) {
  const timestamp = request.headers.get('X-Slack-Request-Timestamp')
  const slackSignature = request.headers.get('X-Slack-Signature')

  const base = `v0:${timestamp}:${JSON.stringify(body)}`
  const hmac = crypto
    .createHmac('sha256', signingSecret)
    .update(base)
    .digest('hex')
  const computedSignature = `v0=${hmac}`

  return computedSignature === slackSignature
}

export async function POST(request: Request) {
  const body = await request.json()
  const requestType = body.type

  // See https://api.slack.com/events/url_verification
  if (requestType === 'url_verification') {
    return new Response(body.challenge, { status: 200 })
  }

  if (await isValidSlackRequest(request, body)) {
    if (requestType === 'event_callback') {
      const eventType = body.event.type
      if (eventType === 'app_mention') {
        await sendGPTResponse(body.event)
        return new Response('Success!', { status: 200 })
      }
    }
  }

  return new Response('OK', { status: 200 })
}
