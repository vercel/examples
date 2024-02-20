import crypto from 'crypto'
import { sendGPTResponse } from './_chat'

export const config = {
  maxDuration: 10,
}

const signingSecret = process.env.SLACK_SIGNING_SECRET!

// See https://api.slack.com/authentication/verifying-requests-from-slack
async function isValidSlackRequest(request: Request, rawBody: string) {
  const timestamp = request.headers.get('X-Slack-Request-Timestamp')
  const slackSignature = request.headers.get('X-Slack-Signature')

  if (!timestamp || !slackSignature) {
    return false
  }

  const base = `v0:${timestamp}:${rawBody}`
  const hmac = crypto
    .createHmac('sha256', signingSecret)
    .update(base)
    .digest('hex')
  const computedSignature = `v0=${hmac}`

  return computedSignature === slackSignature
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const body = JSON.parse(rawBody)
  const requestType = body.type

  // See https://api.slack.com/events/url_verification
  if (requestType === 'url_verification') {
    return new Response(body.challenge, { status: 200 })
  }

  if (await isValidSlackRequest(request, rawBody)) {
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
