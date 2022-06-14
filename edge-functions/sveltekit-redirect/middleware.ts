
export function middleware(request) {
	if (request.nextUrl.pathname === '/') {
		return Response.redirect(new URL('/maintenance', request.url));
	}
}
