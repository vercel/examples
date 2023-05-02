<script>
	import ms from 'ms';
	/**
	 * @type {{id: string, name: string, email: string, image: string, createdAt: string}[]}
	 */
	export let users;
	/**
	 * @type {number}
	 */
	export let duration;

	/**
	 * @param {string | number | Date} timestamp
	 * @param {undefined} [timeOnly]
	 */
	function timeAgo(timestamp, timeOnly) {
		if (!timestamp) return 'never';
		return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? '' : ' ago'}`;
	}
	function refreshPage() {
		location.reload();
	}
</script>

<div
	class="w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
>
	<div class="flex items-center justify-between mb-4">
		<div class="space-y-1">
			<h2 class="text-xl font-semibold">Recent Users</h2>
			<p class="text-sm text-gray-500">
				Fetched {users.length} users in {duration ? duration : 'unknown'} ms
			</p>
		</div>
		<button on:click={refreshPage}>Refresh Page</button>
	</div>
	<div class="divide-y divide-gray-900/5">
		{#each users as user (user.id)}
			<div class="flex items-center justify-between py-3">
				<div class="flex items-center space-x-4">
					<img
						src={user.image}
						alt={user.name}
						width={48}
						height={48}
						class="rounded-full ring-1 ring-gray-900/5"
					/>
					<div class="space-y-1">
						<p class="font-medium leading-none">{user.name}</p>
						<p class="text-sm text-gray-500">{user.email}</p>
					</div>
				</div>
				<p class="text-sm text-gray-500">{timeAgo(user.createdAt)}</p>
			</div>
		{/each}
	</div>
</div>
