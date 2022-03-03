import React from 'react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { LeftPattern } from 'utils/patterns'

import { JWTDemo } from './JWTDemo'
import { JWTMock } from './JWTMock'

export function StatelessDoneRightSection() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeftPattern />

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1 mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Stateless done right
            </h2>
            <p className="mt-3 mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
              Short-lived, automatically-refreshing JWTs provide simple, robust
              security
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-x-8 mb-4">
              <div className="lg:col-span-1">
                <div className="flex items-center">
                  <h2 className={`text-gray-900 text-2xl font-semibold mr-2`}>
                    Short-lived
                  </h2>
                </div>
                <p className="mt-1 text-gray-500 mb-4">
                  Each JWT only lasts 60 seconds. If a session needs to be
                  revoked, this short lifetime ensures attackers will be stopped
                  within 60 seconds.
                </p>
              </div>
              <div className="lg:col-span-1">
                <div className="flex items-center">
                  <h2 className={`text-gray-900 text-2xl font-semibold mr-2`}>
                    Automatically-refreshing
                  </h2>
                </div>
                <p className="mt-1 text-gray-500 mb-4">
                  Clerk&apos;s Next.js SDK automatically refreshes tokens before
                  they expire, so there&apos;s no extra work for developers.
                  Watch it in real - time below.
                </p>
              </div>
            </div>
            <SignedIn>
              <JWTDemo />
            </SignedIn>
            <SignedOut>
              <JWTMock />
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  )
}
