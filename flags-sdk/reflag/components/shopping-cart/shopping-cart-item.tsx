'use client'
import type { CartItem } from '@/components/utils/cart-types'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { colorToImage } from '@/components/utils/images'
import { motion } from 'motion/react'
import Image from 'next/image'
import { ShoppingCartRemoveButton } from './shopping-cart-remove-button'
import Link from 'next/link'

export function EmptyShoppingCartItem() {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="py-6 text-center text-gray-500"
    >
      Your cart is empty.{' '}
      <Link href="/" className="text-blue-600 hover:text-blue-500">
        Continue shopping
      </Link>
    </motion.li>
  )
}

export function ShoppingCartItem({ item }: { item: CartItem }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex py-6"
    >
      <div className="flex-shrink-0 size-24 overflow-hidden rounded-md border border-gray-200">
        {colorToImage[item.color] ? (
          <Image
            src={colorToImage[item.color]}
            alt={`${item.color} T-Shirt`}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>Circles T-Shirt</h3>
            <p className="ml-4">20.00 USD</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {item.color}, {item.size}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">Qty {item.quantity}</p>
          <div className="flex">
            <ShoppingCartRemoveButton item={item} />
          </div>
        </div>
      </div>
    </motion.li>
  )
}
