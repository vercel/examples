<script lang="ts">
	import { Text, Link, Code, Snippet } from '@vercel/examples-ui-svelte';
</script>

<section class="space-y-4">
	<Text variant="h1">Sveltekit Maintenance page</Text>
	<Text
		>In order to create a redirect to a maintenance page, all you have to do is create a <Code
			>middleware.ts</Code
		> file at the root of your project with the following content:</Text
	>
	<pre class="snippet"><code
			>{`export function middleware(request) {
	if (request.nextUrl.pathname === '/') {
		return Response.redirect(new URL('/maintenance', request.url));
	}
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
