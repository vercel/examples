export default async function handler(req, res) {
  const { domain } = req.query

  // not required –> only for this demo to prevent removal of a few restricted domains
  if (restrictedDomains.includes(domain)) {
    return res.status(403).end()
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      },
      method: 'DELETE',
    }
  )

  const json = await response.json()
  res.status(200).send(json)
}

const restrictedDomains = ['portfolio.steventey.com', 'cat.vercel.pub']
