import { put } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url } = await put(body.fileName, body.file, { access: 'public' })
  return { url }
})
