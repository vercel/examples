import { requireSession } from '@clerk/nextjs/edge'
import { withTimer, endTimer, timerResult } from '../../../utils/timer'

// The handler should return a Response object
const handler = async (req) => {
  // The session is already verified, but we want
  // to double-check with Clerk's API to ensure
  // it hasn't been revoked in the last minute
  try {
    const reverify = await req.session.verifyWithNetwork()
  } catch (error) {
    return new Response('Forbidden', { status: 403 })
  }

  endTimer(req)

  return new Response(
    JSON.stringify({
      ...req.session,
      ...timerResult(req),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export default withTimer(requireSession(handler))
