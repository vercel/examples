import { SignInCover } from 'utils/buttons'
import React from 'react'

export const JWTMock = () => {
  return (
    <div className="-mx-2">
      <div className="p-2 text-left">
        <div className="shadow rounded-lg bg-white relative overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  JWT #1
                </h3>
              </div>
            </div>
          </div>
          <div
            className="h-1 transition-all ease-linear duration-100 bg-green-500"
            style={{ width: '33%' }}
          />
          <div className="px-4 py-5 sm:px-6">
            <dl className="flex justify-between">
              <div>
                <dt className="text-sm font-medium text-gray-500">Issued At</dt>
                <dd className="mt-1 text-base sm:text-2xl text-gray-900">
                  {new Date().toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-right text-sm font-medium text-gray-500">
                  Expires In
                </dt>
                <dd
                  className={`text-right mt-1 text-base sm:text-2xl text-green-500`}
                >
                  40 seconds
                </dd>
              </div>
            </dl>
          </div>
          <SignInCover id="jtw_signin">Sign in to see JWT demo</SignInCover>
        </div>
      </div>
    </div>
  )
}
