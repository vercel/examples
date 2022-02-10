import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import useSWRInfinite from 'swr/infinite'
import fetcher, { getKey } from '../lib/fetcher'
import { NftMeta } from './api/nft'
import { NftImage } from '../components/NftImage'
import { Transition } from '@headlessui/react'
import { useInView } from 'react-intersection-observer'
import { MintModal } from '../components/MintModal'
import { Button } from '@vercel/examples-ui'

export default function Home() {
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

  const [open, setOpen] = useState(false)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      setSize(size + 1)
    }
  }, [inView])

  const handleMintModal = () => {
    setOpen(true)
  }

  if (!data)
    return (
      <div className="h-full w-full animate-pulse">
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
          <div className="w-full animate-pulse h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl" />
        </Transition>
      </div>
    )

  return (
    <div className="bg-white">
      <MintModal open={open} setOpen={setOpen} />
      <div className="relative ">
        <div
          aria-hidden="true"
          className="absolute h-full inset-0  opacity-50"
        />

        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-40 lg:px-0">
          <Image src="/vercel-icon-dark.svg" width={100} height={100} />

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Explore and Mint Non Fungible Tokens
          </h1>
          <p className="mt-4 text-xl t">
            Explore the latest art by four favorist artists and upload your art
            to the blockchain!
          </p>

          <Button
            size="lg"
            onClick={handleMintModal}
            variant="black"
            className="mt-8 cursor-pointer inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Mint now!
          </Button>
        </div>
      </div>

      <main>
        {/* Category section */}
        <section
          aria-labelledby="category-heading"
          className="pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8"
        >
          <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0 mb-8">
            <h2
              id="category-heading"
              className="text-3xl font-extrabold tracking-tight text-gray-900"
            >
              Explore popular NFT collections
            </h2>
          </div>

          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {data &&
              data.map((page) =>
                page.map((nft: NftMeta, index: number) => (
                  <NftImage {...nft} key={index + 1} />
                ))
              )}
            <div ref={ref} className="h-full w-full animate-pulse">
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
                <div className="w-full animate-pulse h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl" />
              </Transition>
            </div>
          </ul>
        </section>
      </main>
    </div>
  )
}
