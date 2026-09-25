import qs from 'querystring'

/**
 * This endpoint can be only called once
 *
 * Our `code` is only valid for one request. If we call it more then once,
 * we get "Invalid grant: authorization code is invalid".
 */
export default async function getAccessToken(req, res) {
  const result = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: `${process.env.HOST}/callback` // this parameter should match the Redirect URL in your integration settings on Vercel
    })
  })

  const body = await result.json()

  console.log('https://api.vercel.com/v2/oauth/access_token returned:', JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}