/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@vercel/examples-ui-svelte/tailwind.cjs')],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'node_modules/@vercel/examples-ui-svelte/**/*.{html,js,svelte,ts}'
	]
};
