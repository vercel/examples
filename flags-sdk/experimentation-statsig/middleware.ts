import { type NextRequest, NextResponse } from 'next/server';
import { precompute } from 'flags/next';
import { productFlags } from '@/flags';
import { getStableId } from './utils/get-stable-id';

export const config = {
  matcher: ['/'],
  runtime: 'nodejs',
};

export async function middleware(request: NextRequest) {
  const stableId = await getStableId();

  if (request.nextUrl.pathname === '/') {
    const code = await precompute(productFlags);

    // rewrites the request to the variant for this flag combination
    const nextUrl = new URL(
      `/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
      request.url,
    );

    return NextResponse.rewrite(nextUrl, {
      request,
      headers: stableId.isFresh
        ? { 'set-cookie': `stable-id=${stableId.value}` }
        : undefined,
    });
  }
}
