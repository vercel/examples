import { Fragment } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { SignInButton } from 'utils/buttons'

import { PatternImage } from './Pattern'

const NAVBAR_LINKS = [
  {
    name: 'Clerk Homepage',
    href: 'https://clerk.dev?utm_source=edge-demo&utm_medium=next-edge-auth&utm_campaign=home',
  },
  {
    name: 'More about Clerk and Next.js',
    href: 'https://clerk.dev/solutions/nextjs-authentication?utm_source=edge-demo&utm_medium=next-edge-auth&utm_campaign=more-hero',
  },
]

export function HeroSection() {
  return (
    <div className="bg-gray-50">
      <div className="relative overflow-hidden">
        <PatternImage />
        <div className="relative pt-4 sm:pt-6 pb-16 sm:pb-24">
          <Popover>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <nav
                className="relative md:flex items-center justify-between md:justify-between"
                aria-label="Global"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <Image
                      src="/clerk-x-next.svg"
                      alt="Clerk and Next.js"
                      height={50}
                      width={227}
                    />
                    <div className="flex items-center md:hidden">
                      <SignedIn>
                        <UserButton afterSignOutAllUrl="/" />
                      </SignedIn>
                      <Popover.Button className="ml-4 bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open main menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex md:space-x-5 lg:space-x-10">
                  {NAVBAR_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="font-medium text-gray-500 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="hidden md:relative md:flex md:items-center md:justify-end w-20">
                  <SignedIn>
                    <UserButton afterSignOutAllUrl="/" />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Sign in
                    </SignInButton>
                  </SignedOut>
                </div>
              </nav>
            </div>

            <Transition
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                className="absolute z-10 top-0 inset-x-0 p-2 transition origin-top-right md:hidden"
              >
                <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="px-5 pt-4 flex justify-between">
                    <div>
                      <Image
                        className="h-8 w-auto"
                        src="/clerk-x-next.svg"
                        alt="Clerk and Next.js"
                        height={50}
                        width={227}
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close main menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {NAVBAR_LINKS.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                    <SignedOut>
                      <div>
                        <SignInButton className="block mt-2 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign in
                        </SignInButton>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <div className="mt-16 mx-auto max-w-7xl sm:mt-24 px-4 sm:px-6">
            <div className="text-center">
              <h1 className="tracking-tight font-extrabold text-gray-900">
                <span className="block text-4xl sm:text-6xl md:text-6xl">
                  Authentication&nbsp;at the&nbsp;edge
                </span>
                <span className="block text-indigo-600 mt-2 text-3xl sm:text-5xl md:text-5xl">
                  with Clerk and Next.js
                </span>
              </h1>
              <p className="hidden mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Authenticate users in milliseconds at edge with Clerk and
                Next.js
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
