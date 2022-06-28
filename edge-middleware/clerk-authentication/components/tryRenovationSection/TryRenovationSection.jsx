import React from 'react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { LeftPattern } from 'utils/patterns'

import { SessionList } from './SessionList'
import { SessionMock } from './SessionMock'

export function TryRenovationSection() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeftPattern />

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1 mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Try revocation
            </h2>
            <p className="mt-3 mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
              Sign in on two devices to test revocation
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-x-8">
              <SignedIn>
                <SessionList />
              </SignedIn>
              <SignedOut>
                <SessionMock />
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
