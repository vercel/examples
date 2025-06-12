'use client'

import { removeFromCart } from '@/lib/actions'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { CartItem } from '@/components/utils/cart-types'

function Spinner() {
  return (
    <motion.div
      initial={{ scale: 0, x: 0, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, x: 0, opacity: 1, rotate: 360 }}
      exit={{ scale: 0, x: 0, opacity: 0, rotate: 0 }}
      transition={{ rotate: { duration: 1, ease: 'linear', repeat: Infinity } }}
      className="inline-block size-4 rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"
    />
  )
}

export function ShoppingCartRemoveButton({ item }: { item: CartItem }) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        setIsLoading(true)
        await removeFromCart(item)
        // Only end the spinner if the item is not the last one, as the item
        // unmounts when the last one is removed
        if (item.quantity !== 1) setIsLoading(false)
      }}
      disabled={isLoading}
      className="cursor-pointer font-medium text-blue-600 hover:text-blue-500 disabled:opacity-70 flex items-center gap-2"
    >
      <AnimatePresence mode="popLayout">
        {isLoading && <Spinner />}
        <motion.span
          layout
          key="text"
          initial={{ x: isLoading ? 12 : 0 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', bounce: 0.3 }}
        >
          Remove
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
