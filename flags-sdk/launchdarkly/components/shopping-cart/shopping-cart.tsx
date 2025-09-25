import { getCart } from '@/lib/actions'
import { Suspense } from 'react'
import { ShoppingCartList } from './shopping-cart-list'
import { EmptyShoppingCartItem, ShoppingCartItem } from './shopping-cart-item'

function ShoppingCartContentFallback() {
  return (
    <ul className="-my-6 divide-y divide-gray-200">
      <li className="flex py-6 animate-pulse">
        <div className="flex-shrink-0 size-24 overflow-hidden rounded-md border border-gray-200 bg-gray-200" />
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <div className="h-5 w-24 bg-gray-200 rounded mt-1" />
              <div className="ml-4 h-5 w-20 bg-gray-200 rounded mt-1" />
            </div>
            <div className="mt-1 h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-1 items-end justify-between text-sm mt-4">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-14 bg-gray-200 rounded" />
          </div>
        </div>
      </li>
    </ul>
  )
}

async function ShoppingCartContent() {
  const { items } = await getCart()
  return (
    <ShoppingCartList>
      {items.length === 0 ? (
        <EmptyShoppingCartItem />
      ) : (
        items.map((item) => (
          <ShoppingCartItem
            key={[item.id, item.color, item.size].join('/')}
            item={item}
          />
        ))
      )}
    </ShoppingCartList>
  )
}

export function ShoppingCart() {
  return (
    <section className="lg:col-span-7">
      <div className="mx-auto max-w-2xl px-0 lg:max-w-none">
        <h1 className="text-xl font-medium text-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="border-t border-gray-200 pt-8">
          <div className="flow-root">
            <Suspense fallback={<ShoppingCartContentFallback />}>
              <ShoppingCartContent />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
