import { put } from '@vercel/blob'

export default defineFormActions({
  default: async (event) => {
    const formData = await readFormData(event)
    console.log('formData')
    console.log(formData)
    const file = formData.get('image-upload') as File

    if (!file) {
      throw Error('No file to upload.')
    }

    const { url } = await put(file.name, file, { access: 'public' })
    console.log('url', url)

    return actionResponse(event, { url })
  },
})
