import { error } from '@sveltejs/kit'
import { get } from '@vercel/blob'
import { env } from '$env/dynamic/private'

// Delivery route for private blobs.
// Private blob URLs are not directly accessible in the browser.
// This route streams the blob content after authenticating the request.
// See: https://vercel.com/docs/vercel-blob/private-storage
export async function GET({ url }) {
  // ⚠️ Add your own authentication here.

  const pathname = url.searchParams.get('pathname')

  if (!pathname) {
    error(400, { message: 'Missing pathname' })
  }

  const result = await get(pathname, {
    access: 'private',
    token: env.BLOB_READ_WRITE_TOKEN,
  })

  if (result?.statusCode !== 200) {
    error(404, { message: 'Not found' })
  }

  return new Response(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
