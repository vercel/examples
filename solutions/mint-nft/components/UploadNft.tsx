import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { isImageSafe } from '../helpers/sanitize.helpers';
import { Text, LoadingDots } from '@vercel/examples-ui';
import axios from "axios";

type Props = {
  onDone: (asset: any) => void
}

export const UploadNft: React.VFC<Props> = ({ onDone }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [imageWarning, setImageWarning] = useState<string>('')
  const [, setDisabled] = useState<boolean>(true)
  const [imageData, setImageData] = useState<{ path: string; content: string; }[]>([]);

  const getBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      if (reader.result) {
        setImageData([
          {
            path: file?.name,
            content: (reader.result as string)?.replace("data:image/png;base64,", ""),
          }
        ]);
      }
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

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

      getBase64(data);
    } catch (e) {
      console.error(e)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  useEffect(() => {
    const upload = async () => {
      const { data: dataRes } = await axios.post('/api/ipfs/upload-folder', { uploadArray: imageData }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false)
      setDisabled(false)
      onDone(dataRes?.[0]?.path)
    }
    if (imageData?.length > 0) {
      upload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);



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
