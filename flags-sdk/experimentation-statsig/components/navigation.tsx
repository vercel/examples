import {
  Bars3Icon,
  ShoppingBagIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

const navigation = ['Home', 'Sale', 'New', 'Shirts', 'Stickers']

export function Navigation() {
  return (
    <header className="relative bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex flex-1 items-center lg:hidden">
            <button
              type="button"
              className="-ml-2 rounded-md bg-white p-2 text-gray-400"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex h-full space-x-8">
            <span className="hidden lg:flex w-full items-center justify-center">
              <ShoppingBagIcon className="h-8 w-auto" />
            </span>

            {navigation.map((page) => (
              <span
                key={page}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                {page}
              </span>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="ml-4 flow-root lg:ml-6">
              <span className="group -m-2 flex items-center p-2">
                <ShoppingCartIcon
                  className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}