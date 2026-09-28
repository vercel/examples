import { checkBotId } from 'botid/server'
import { relayEveRequest } from '@/lib/eve-proxy'

async function relay(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return relayEveRequest(
    request,
    `/${path.map(encodeURIComponent).join('/')}`,
    checkBotId
  )
}

export { relay as GET, relay as POST }
