export default async function handler(req, res) {
  const { domain } = req.query

  const [configResponse, domainResponse] = await Promise.all([
    fetch(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ),
    fetch(
      `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ),
  ])

  const configJson = await configResponse.json()
  const domainJson = await domainResponse.json()
  if (domainResponse.status !== 200) {
    return res.status(domainResponse.status).send(domainJson)
  }

  /**
   * If domain is not verified, we try to verify now
   */
  let verificationResponse = null
  if (!domainJson.verified) {
    const verificationRes = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    verificationResponse = await verificationRes.json()
  }

  if (verificationResponse && verificationResponse.verified) {
    /**
     * Domain was just verified
     */
    return res.status(200).json({
      configured: !configJson.misconfigured,
      ...verificationResponse,
    })
  }

  return res.status(200).json({
    configured: !configJson.misconfigured,
    ...domainJson,
    ...(verificationResponse ? { verificationResponse } : {}),
  })
}
