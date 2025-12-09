import { ImFilePicture } from 'react-icons/im'
import { useDropzone } from 'react-dropzone'
import { useEffect } from 'react'
import Image from 'next/image'

type Props = {
  image: any
  setImage: (image: any) => void
}

const FileUploader = ({ image, setImage }: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      setImage(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )[0]
      )
    },
  })

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    if (image) {
      return () => URL.revokeObjectURL(image.preview)
    } else return

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-12">
      <p className="text-2xl font-semibold">Upload Image</p>
      <div
        {...getRootProps({
          className:
            'dropzone w-full border-[1.5px] bg-gray-100 border-dashed p-5 border-gray-400 rounded-xl flex flex-col gap-5 justify-center text-center items-center mt-5 cursor-pointer overflow-hidden',
        })}
      >
        <input {...getInputProps()} />

        {image ? (
          <Image
            src={image.preview}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(image.preview)
            }}
            className="object-contain"
            alt="NFT Image"
            width={500}
            height={500}
          />
        ) : (
          <div className="flex h-44 flex-col items-center justify-center">
            <p className="text-center">PNG, JPEG, or GIF. Max 10mb. </p>
            <ImFilePicture className="mt-4 text-5xl" />
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploader
