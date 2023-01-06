import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { isImageSafe } from '../helpers/sanitize.helpers'

import { Button, Text, LoadingDots } from '@vercel/examples-ui'
import Moralis from 'moralis-v1'

type Props = {
  onDone: (asset: Moralis.File) => void
}

export const UploadNft: React.VFC<Props> = ({ onDone }) => {
  const [loading, setLoading] = useState(false)
  const [imageWarning, setImageWarning] = useState('')
  const [disabled, setDisabled] = useState(true)

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setLoading(true)
      setImageWarning('')

      const data = acceptedFiles[0]

      const imageSafety = await isImageSafe(data)

      if (Object.values(imageSafety).some((safe) => !safe)) {
        setLoading(false)
        setImageWarning('Please try a different image')
        return
      }

      const imageFile = new Moralis.File(data.name, data)

      await imageFile.saveIPFS()
      setLoading(false)
      setDisabled(false)
      onDone(imageFile)
    } catch (e) {
      console.error(e)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="flex flex-col">
      <Text variant="h2">Select the image you want to mint as an NFT</Text>
      <Text className="mt-6">
        This image will be validated and stored on IPFS.
      </Text>
      <div className="mt-2 ">
        <div {...getRootProps()} className="mt-6 sm:col-span-2 ">
          <div className="flex flex-col items-center m justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {loading ? (
                <div className="h-12">
                  <LoadingDots />
                </div>
              ) : (
                <>
                  <div className="flex text-sm items-center text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium  focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <Text className="text-bold underline" variant="body">
                        Upload a file
                      </Text>
                      <input
                        {...getInputProps()}
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>
        {imageWarning.length > 0 && !loading && (
          <aside
            role="alert"
            className="flex w-full justify-center mt-4 text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600"
          >
            {imageWarning}
          </aside>
        )}
      </div>
    </div>
  )
}
