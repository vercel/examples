export default function middleware(request) {
	if (new URL(request.url).pathname === '/') {
		return Response.redirect(new URL('/maintenance', request.url));
	}
}