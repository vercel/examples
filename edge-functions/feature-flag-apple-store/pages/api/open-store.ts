// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default function OpenStore(request: NextRequest) {}
