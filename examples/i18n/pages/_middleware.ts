import type { EdgeRequest, EdgeResponse } from 'next'

export async function middleware (
  req: EdgeRequest,
  res: EdgeResponse,
) {
  const country = req.geo?.country?.toLowerCase() || 'us';
  const locale = req.headers.get('accept-language')?.split(',')?.[0] || 'en-US';

  res.rewrite({
    ...req.url,
    pathname: `/${locale}/${country}`,
  })
}
