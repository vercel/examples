<section class="space-y-4">
	<h1>Sveltekit Maintenance page</h1>
	<p>
		In order to create a redirect to a maintenance page, all you have to do is create a <code
			>middleware.ts</code
		> file at the root of your project with the following content:
	</p>
	<pre class="snippet"><code
			>{`export default function middleware(request, response) {
	if (new URL(request.url).pathname === '/') {
		return Response.redirect(new URL('/maintenance', request.url));
	}

	return new Response(null, {
		headers: {
		  'x-middleware-next': '1',
		},
	  });
}`}</code
		></pre>
</section>

<style>
	.snippet {
		border-color: var(--accents-2);
		border-width: 1px;
		border-radius: 0.375rem;
		background-color: var(--accents-1);
		overflow-x: auto;
		padding: 1.5rem;
	}
</style>
