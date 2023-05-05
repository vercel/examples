import { error } from '@sveltejs/kit'
import { put } from '@vercel/blob'

export const actions = {
  upload: async ({ request }) => {
    const form = await request.formData()
    const file = form.get('image-upload') as File

    if (!file) {
      throw error(400, { message: 'No file to upload.' })
    }

    const { url } = await put(file.name, file, { access: 'public' })
    return { uploaded: url }
  },
}
