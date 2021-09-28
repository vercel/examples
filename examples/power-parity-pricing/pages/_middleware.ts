import type { EdgeRequest, EdgeResponse } from 'next'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
) {
  const country = req.geo?.country || 'US';

  res.rewrite({
    ...req.url,
    pathname: `/${country}`,
    query: {
      ...req.url.query,
      country,
    },
  })
}
