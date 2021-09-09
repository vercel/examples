import type { EdgeRequest, EdgeResponse } from 'next';
import datadome from '@lib/datadome';

export async function middleware(req: EdgeRequest, res: EdgeResponse, next) {
  if (req.url.pathname === '/omit') {
    next();
    return;
  }

  const latency = await datadome(
    req,
    res,
    req.url.pathname === '/no-connection' ? { Connection: 'close' } : {}
  );

  if (!latency) return;
  if (req.url.pathname === '/' || req.url.pathname === '/no-connection') {
    res.setHeader(
      'x-datadome-latency',
      String(latency === true ? 'Unavailable' : latency)
    );
  }

  next();
}
