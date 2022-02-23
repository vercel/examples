import { requireSession } from '@clerk/nextjs/edge'
import { withTimer, endTimer, timerResult } from '../../../utils/timer'

// The handler should return a Response object
const handler = async (req) => {
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
