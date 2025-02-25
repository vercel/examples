import { type NextRequest, NextResponse } from 'next/server';
import { precompute } from 'flags/next';
import { precomputeFlags, bannerFlags } from '@/flags';
import { getOrGenerateVisitorId } from './utils/generateVisitorId';

export const config = { matcher: ['/', '/precomputed-pages-router-example'] };

export async function middleware(request: NextRequest) {
  const generatedVisitorId = await getOrGenerateVisitorId();
  console.log('visitor', generatedVisitorId);

  if (request.nextUrl.pathname === '/') {
    const code = await precompute(precomputeFlags);

    // rewrites the request to the variant for this flag combination
    const nextUrl = new URL(
      `/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
      request.url,
    );
    return NextResponse.rewrite(nextUrl, {
      request,
      headers: generatedVisitorId.fresh
        ? { 'set-cookie': `visitor-id=${generatedVisitorId.value}` }
        : undefined,
    });
  }

  if (request.nextUrl.pathname === '/precomputed-pages-router-example') {
    const code = await precompute(bannerFlags);

    // rewrites the request to the variant for this flag combination
    const nextUrl = new URL(
      `/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
      request.url,
    );
    return NextResponse.rewrite(nextUrl, { request });
  }
}
