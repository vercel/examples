import React, { useState } from 'react'
import Image from 'next/image'
import { MintModal } from '../components/MintModal'
import { Button } from '@vercel/examples-ui'

export default function Home() {
  const [open, setOpen] = useState(false)

  const handleMintModal = () => {
    setOpen(true)
  }

  return (
    <div className="bg-white h-full">
      <MintModal open={open} setOpen={setOpen} />
      <div className="relative ">
        <div
          aria-hidden="true"
          className="absolute h-full inset-0  opacity-50"
        />

        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-40 lg:px-0">
          <Image
            src="/vercel-icon-dark.svg"
            alt="vercel logo"
            width={100}
            height={100}
          />

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
