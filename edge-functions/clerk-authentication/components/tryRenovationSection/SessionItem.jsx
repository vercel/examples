import { useSession } from '@clerk/nextjs'
import React from 'react'

export const SessionItem = ({ userSession, index }) => {
  // currentSession is the particular session on this device
  const currentSession = useSession()
  const sessionBelongsToThisDevice = currentSession.id === userSession.id
  const activity = userSession.latestActivity

  const revokeSession = () => {
    return userSession.revoke()
  }

  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Device #{index + 1}{' '}
            {sessionBelongsToThisDevice && (
              <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                This device
              </span>
            )}
          </h3>
        </div>
        <div className="shrink-0">
          {!sessionBelongsToThisDevice ? (
            <button
              type="button"
              className="relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={revokeSession}
            >
              Revoke
            </button>
          ) : (
            <div style={{ height: '34px' }} />
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        <div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">IP Address</dt>
              <dd className="mt-1 text-gray-900 text-ellipsis">
                {activity.ipAddress}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Device type</dt>
              <dd className="mt-1 text-gray-900">
                {activity.isMobile ? 'Mobile' : 'Desktop'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Browser</dt>
              <dd className="mt-1 text-gray-900">{activity.browserName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Operating system
              </dt>
              <dd className="mt-1 text-gray-900">{activity.deviceType}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
