'use client'
import Image from 'next/image'
import { toast } from 'sonner'
import pool from '@/public/images/pool.jpg'

export function SummerSaleBanner() {
  const onClick = () => {
    toast('End reached', {
      className: 'my-classname',
      description:
        'The summer sale is not implemented in this template. Try adding to the cart instead.',
    })
  }
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0">
            <Image
              src={pool}
              alt="Summer Sale"
              className="h-full w-full object-cover object-center"
              loading="eager"
              priority
              placeholder="blur"
            />
          </div>
          <div className="relative  px-6 py-32 sm:px-12 sm:py-16 lg:px-16">
            <div className="relative mx-auto flex max-w-3xl flex-col items-start text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block sm:inline">Summer Sale</span>
              </h2>
              <p className="mt-3 text-xl text-white">
                Enjoy 20% off all summer basics,
                <br />
                including swimwear and accessories.
              </p>
              <button
                type="button"
                className="cursor-pointer mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                onClick={onClick}
              >
                Shop now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
