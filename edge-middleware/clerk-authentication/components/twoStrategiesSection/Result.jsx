import React from 'react'

export const Result = ({ result }) => {
  return (
    <dl className="grid gap-x-4 gap-y-6 sm:gap-y-4 md:gap-y-6 grid-cols-2">
      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">Response time</dt>
        {result ? (
          <dd className="mt-1 text-2xl text-gray-900">
            {result.responseTime} ms
          </dd>
        ) : (
          <dd className="mt-1 text-2xl text-gray-900">-- ms</dd>
        )}
      </div>
      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">
          Authentication speed
        </dt>
        {result ? (
          <dd className="mt-1 text-2xl text-gray-900">
            {result.authenticationTime || '< 1'} ms
          </dd>
        ) : (
          <dd className="mt-1 text-2xl text-gray-900">-- ms</dd>
        )}
      </div>

      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">Response region</dt>
        {result ? (
          <dd className="mt-1 text-gray-900">{result.responseRegion}</dd>
        ) : (
          <dd className="mt-1 text-gray-900">--</dd>
        )}
      </div>

      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">User ID</dt>
        {result ? (
          <dd className="mt-1 text-gray-900 overflow-hidden text-ellipsis">
            {result.userId}
          </dd>
        ) : (
          <dd className="mt-1 text-gray-900">--</dd>
        )}
      </div>
    </dl>
  )
}
