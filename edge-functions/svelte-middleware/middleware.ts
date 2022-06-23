export default function middleware(request) {
	console.log('middleware', new URL(request.url).pathname);
	if (new URL(request.url).pathname === '/blocked') {
		return Response.redirect(new URL('/', request.url));
	}

	return new Response(null, {
		headers: {
			'x-middleware-next': '1'
		}
	});
}
