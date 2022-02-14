import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

type props = {
  height?: number
  width?: number
  alt: string
  src: string
}

export const NftImage: React.VFC<props> = ({
  alt,
  src,
  height = 500,
  width = 500,
}) => {
  return (
    <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
      <Image
        className="rounded-xl"
        src={src}
        alt={alt}
        height={height}
        width={width}
      />
    </div>
  )
}
