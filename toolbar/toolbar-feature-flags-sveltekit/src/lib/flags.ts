import { flag } from '@vercel/flags/sveltekit'

export const svelteColor = flag<boolean>({
  key: 'svelteColor',
  description: 'Use the Svelte color for the headline', // optional
  origin: 'https://example.com/#svelteColor', // optional
  options: [{ value: true }, { value: false }], // optional
  // can be async and has access to the event
  decide(event) {
    // Very simple example to show how to use the URL to determine the flag.
    // In real live you would probably query an external source such as
    // Vercel Edge Config (https://vercel.com/docs/storage/edge-config)
    return event.url.searchParams.has('svelteColor')
  },
})
