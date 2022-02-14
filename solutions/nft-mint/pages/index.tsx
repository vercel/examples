import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import useSWRInfinite from 'swr/infinite'
import fetcher, { getKey } from '../lib/fetcher'
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
    <div className="bg-white h-full">
      <MintModal open={open} setOpen={setOpen} />
      <div className="relative ">
        <div
          aria-hidden="true"
          className="absolute h-full inset-0  opacity-50"
        />

        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-40 lg:px-0">
          <Image src="/vercel-icon-dark.svg" width={100} height={100} />

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Mint Non Fungible Tokens
          </h1>
          <p className="mt-4 text-xl t">
            Explore how the necessary steps to mint an NFT using Rarible and
            Moralis.
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
    </div>
  )
}
