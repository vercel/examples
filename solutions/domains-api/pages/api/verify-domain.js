export default async function handler(req, res) {
  const { domain } = req.query

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}/verify?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )

  const data = await response.json()
  res.status(response.status).send(data)
}
