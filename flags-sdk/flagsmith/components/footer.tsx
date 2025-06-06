import { ShoppingBagIcon } from '@heroicons/react/24/outline'

const navigation = [
  'Home',
  'About',
  'Terms & Conditions',
  'Shipping & Return Policy',
  'Privacy Policy',
  'FAQ',
]

export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 py-20">
          <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
            <div className="col-span-1 md:col-span-2 lg:col-start-1 lg:row-start-1">
              <ShoppingBagIcon className="h-8 w-auto" />
            </div>

            <div className="col-span-6 mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 md:mt-0 lg:col-span-6 lg:col-start-2">
              <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                <ul role="list" className="mt-2 space-y-6">
                  {navigation.map((item) => (
                    <li key={item} className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
