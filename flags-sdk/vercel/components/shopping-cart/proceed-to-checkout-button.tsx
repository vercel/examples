'use client'

const colorMap: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  red: 'bg-red-600 hover:bg-red-700',
  green: 'bg-green-600 hover:bg-green-700',
}

export function ProceedToCheckoutButton({
  color,
  onClick,
}: {
  color: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`${colorMap[color]} cursor-pointer w-full rounded-full border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50`}
      onClick={onClick}
    >
      Proceed to Checkout
    </button>
  )
}
