'use client'

import { motion, AnimatePresence } from 'motion/react'

function Spinner() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.1, rotate: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: 360,
      }}
      transition={{
        rotate: {
          duration: 1,
          ease: 'linear',
          repeat: Infinity,
        },
      }}
      exit={{ scale: 0, opacity: 0.1 }}
      className="inline-block size-4 rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"
    />
  )
}

export function AddToCartButton({
  onClick,
  isLoading,
}: {
  onClick: () => {}
  isLoading: boolean
}) {
  return (
    <button
      type="button"
      className="cursor-pointer mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-700"
      onClick={onClick}
      disabled={isLoading}
    >
      <AnimatePresence mode="popLayout">
        {isLoading && <Spinner />}
        <motion.span
          layout
          key="text"
          initial={{ x: isLoading ? 12 : 0 }}
          animate={{ x: 0 }}
          transition={{ type: 'tween', ease: 'anticipate' }}
        >
          Add to cart
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
