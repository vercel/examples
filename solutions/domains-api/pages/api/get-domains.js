export default async function handler(req, res) {
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  )
  const json = await response.json()

  // not required –> only for this demo to prevent removal of the demo's domain
  const filteredDomains = json.domains.filter(
    (domain) => domain.name !== 'domains-api.vercel.app'
  )

  res.status(response.status).send(filteredDomains)
}
