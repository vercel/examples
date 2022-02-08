import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { NftMeta } from '../pages/api/nft'

type props = NftMeta & {
  height?: number
  width?: number
}

export const NftImage: React.VFC<props> = ({
  alt,
  imageSrc,
  height = 500,
  width = 500,
  href,
}) => {
  return (
    <li className="relative cursor-pointer">
      <Link href={href}>
        <a target="_blank">
          <Transition
            as={Fragment}
            show={true}
            enter="transform transition duration-[100ms]"
            enterFrom="opacity-0 rotate-[-120deg] scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100 "
            leaveTo="opacity-0 scale-95 "
          >
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              <Image
                className="rounded-xl"
                src={imageSrc}
                alt={alt}
                height={height}
                width={width}
              />
            </div>
          </Transition>
        </a>
      </Link>
    </li>
  )
}
