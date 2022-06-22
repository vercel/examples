export default function middleware(request) {
	if (new URL(request.url).pathname === '/') {
		return Response.redirect(new URL('/maintenance', request.url));
	}

	return new Response(null, {
		headers: {
			'x-middleware-next': '1'
		}
	});
}
