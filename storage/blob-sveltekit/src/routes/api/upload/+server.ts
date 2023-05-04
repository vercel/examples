import { error, json } from '@sveltejs/kit'
import * as vercelBlob from '@vercel/blob'

export const POST = async ({ request }) => {
  const form = await request.formData()
  const file = form.get('file') as File

  if (!file) {
    throw error(400, { message: 'No file to upload.' })
  }

  const blob = await vercelBlob.put(file.name, file, { access: 'public' })

  return json(blob)
}
