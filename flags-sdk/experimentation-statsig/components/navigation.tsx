import { getCart } from '@/lib/actions'
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Suspense } from 'react'

const navigation = ['Home', 'Sale', 'New', 'Shirts', 'Stickers']

function ShoppingCartNavItemFallback() {
  return (
    <Link href="/cart" className="group -m-2 flex items-center p-2">
      <ShoppingCartIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
      <span className="ml-2 w-3 h-4 rounded text-sm font-medium bg-gray-200" />
    </Link>
  )
}

async function ShoppingCartNavItem() {
  const cart = await getCart()
  return (
    <Link href="/cart" className="group -m-2 flex items-center p-2">
      <ShoppingCartIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
      <span className="ml-2 min-w-3 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
      </span>
    </Link>
  )
}

export function Navigation() {
  return (
    <header className="relative bg-white mx-auto max-w-2xl  lg:max-w-7xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between max-w-2xl lg:max-w-none mx-auto">
          <div className="flex flex-1 items-center lg:hidden">
            <button type="button" className="-ml-2 rounded-md bg-white p-2">
              <Link
                href="/"
                className="lg:flex w-full items-center justify-center"
              >
                <ShoppingBagIcon className="h-6 w-6" />
              </Link>
            </button>
          </div>

          <div className="hidden lg:flex h-full space-x-8">
            <Link
              href="/"
              className=" lg:flex w-full items-center justify-center"
            >
              <ShoppingBagIcon className="h-8 w-auto" />
            </Link>

            {navigation.map((page) => {
              return (
                <span
                  key={page}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  {page === 'Home' ? <Link href="/">Home</Link> : page}
                </span>
              )
            })}
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="ml-4 flow-root lg:ml-6">
              <Suspense fallback={<ShoppingCartNavItemFallback />}>
                <ShoppingCartNavItem />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
