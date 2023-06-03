<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<h1>Sveltekit + Flask Starter</h1>
<pre>{JSON.stringify(data, null, 2)}</pre>
