import { error } from '@sveltejs/kit'
import { put } from '@vercel/blob'
import { env } from '$env/dynamic/private'

export const actions = {
  upload: async ({ request }) => {
    const form = await request.formData()
    const file = form.get('image-upload') as File

    if (!file) {
      error(400, { message: 'No file to upload.' })
    }

    const { url } = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
      token: env.BLOB_READ_WRITE_TOKEN,
    })
    return { uploaded: url }
  },
}
