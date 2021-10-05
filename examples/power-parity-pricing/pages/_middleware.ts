import type { EdgeRequest, EdgeResponse } from 'next'

export async function middleware(req: EdgeRequest, res: EdgeResponse) {
  const country = req.geo?.country?.toLowerCase() || 'us'

  res.rewrite({
    ...req.url,
    pathname: `/${country}`,
  })
}
