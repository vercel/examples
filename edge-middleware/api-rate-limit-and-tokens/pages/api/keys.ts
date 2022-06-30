import type { NextApiRequest, NextApiResponse } from 'next'
import { base64url, SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import { API_KEYS, API_KEYS_JWT_SECRET_KEY } from '@lib/api/constants'
import type { ApiTokenPayload } from '@lib/api/keys'
import { upstashRest } from '@lib/upstash'

const decode = (jwt: string) =>
  JSON.parse(new TextDecoder().decode(base64url.decode(jwt.split('.')[1])))

export default async function keys(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'PUT': {
        // The API Key can be used to make 500 requests per minute
        const payload: ApiTokenPayload = {
          jti: nanoid(),
          iat: Date.now() / 1000,
          limit: 500,
          timeframe: 60,
        }
        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(new TextEncoder().encode(API_KEYS_JWT_SECRET_KEY))
        const data = await upstashRest(['HSET', API_KEYS, payload.jti, token])

        return res.status(200).json({ done: data.result === 1 })
      }
      case 'GET': {
        const { result } = await upstashRest(['HGETALL', API_KEYS])
        const apiKeys = []

        // Normalize the rules from [key, value, key, value] to [[key, value]]
        for (let i = 0; i < result.length; i += 2) {
          apiKeys.push([result[i + 1], decode(result[i + 1])])
        }

        return res.status(200).json({ apiKeys })
      }
      case 'DELETE': {
        const { key } = req.query
        const payload =
          key && typeof key === 'string'
            ? (decode(key) as ApiTokenPayload)
            : null

        if (!payload) {
          return res.status(400).json({ error: { message: 'Invalid request' } })
        }

        const data = await upstashRest(['HDEL', API_KEYS, payload.jti])

        return res.status(200).json({ done: data.result === 1 })
      }
      default:
        res.status(405).json({
          error: { message: 'Method not allowed' },
        })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: { message: `An error ocurred, ${err}` },
    })
  }
}
