import { SignInCover } from 'utils/buttons'
import React from 'react'

export const SessionMock = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden relative">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Device #1{' '}
            <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
              This device
            </span>
          </h3>
        </div>
        <div className="shrink-0">
          <div style={{ height: '34px' }} />
        </div>
      </div>

      <div className="px-4 py-3 relative">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">IP Address</dt>
            <dd className="mt-1 text-gray-900 text-ellipsis">--</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Device type</dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Browser</dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Operating system
            </dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>
        </dl>
        <SignInCover id="device_signin">
          Sign in to see device details
        </SignInCover>
      </div>
    </div>
  )
}
