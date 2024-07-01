import { flag } from '@vercel/flags/sveltekit'

export const shouldUseSvelteColor = flag<boolean>({
  key: 'useSvelteColor',
  description: 'Use the Svelte color for the headline', // optional
  origin: 'https://example.com/#useSvelteColor', // optional
  options: [{ value: true }, { value: false }], // optional
  // can be async and has access to the event
  decide(event) {
    // Very simple example to show how to use the URL to determine the flag.
    // In real live you would probably query your database or a service.
    return event.url.searchParams.has('useSvelteColor')
  },
})
