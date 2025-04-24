'use client'

import { toast } from 'sonner'

const colorMap: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  red: 'bg-red-600 hover:bg-red-700',
  green: 'bg-green-600 hover:bg-green-700',
  skeleton: 'bg-gray-300 animate-pulse',
}

export function ProceedToCheckoutButton({ color }: { color: string }) {
  return (
    <button
      type="button"
      className={`${colorMap[color]} cursor-pointer w-full rounded-full border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50`}
      onClick={() => {
        // Auto capture will track the event
        toast('End reached', {
          className: 'my-classname',
          description: 'The checkout flow is not implemented in this template.',
          duration: 5000,
        })
      }}
    >
      Proceed to Checkout
    </button>
  )
}
