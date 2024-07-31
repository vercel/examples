import { createHandle } from '@vercel/flags/sveltekit'
import { FLAGS_SECRET } from '$env/static/private'
import * as flags from '$lib/flags'

// The `createHandle` function wires up the feature flags with the Vercel toolbar
// and makes sure you can easily query the flags in your server load functions.
// See the readme for more info on generating and retrieving the FLAGS_SECRET env var.
export const handle = createHandle({ secret: FLAGS_SECRET, flags })
