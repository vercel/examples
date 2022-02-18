import * as nsfwjs from 'nsfwjs'

export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = URL.createObjectURL(file)

    image.onload = () => {
      let canvas = document.createElement('canvas')
      let width = image.width
      let height = image.height

      if (width <= maxWidth && height <= maxHeight) {
        let context = canvas.getContext('2d')

        context!.drawImage(image, 0, 0, width, height)

        resolve(canvas)
        return
      }

      let newWidth
      let newHeight

      if (width > height) {
        newHeight = height * (maxWidth / width)
        newWidth = maxWidth
      } else {
        newWidth = width * (maxHeight / height)
        newHeight = maxHeight
      }

      canvas.width = newWidth
      canvas.height = newHeight

      let context = canvas.getContext('2d')

      context!.drawImage(image, 0, 0, newWidth, newHeight)

      resolve(canvas)
    }
    image.onerror = reject
  })
}

/**
 * since the model is not perfect we need some fall backs. If the predictions don't go true it's better to refuse the image
 * @param file the on drop file from the input we want to validate
 * @returns an object containing predictions about the unsafe categories
 */
export const isImageSafe = async (file: File) => {
  const unsafeFallback = { isPornSafe: false, isHentaiSafe: false }

  try {
    const img = await resizeImage(file, 300, 300)
    const model = await nsfwjs.load()
    const predictions = await model?.classify(img)

    const pornPred = predictions.find((pred) => pred.className === 'Porn')
    const hentaiPred = predictions.find((pred) => pred.className === 'Hentai')

    if (!pornPred || !hentaiPred) {
      return unsafeFallback
    }

    return {
      isPornSafe: pornPred.probability < 0.3,
      isHentaiSafe: hentaiPred.probability < 0.3,
    }
  } catch (e) {
    console.error(e)
    return unsafeFallback
  }
}
