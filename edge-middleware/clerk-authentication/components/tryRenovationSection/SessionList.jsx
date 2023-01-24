import { useSession, useUser } from '@clerk/nextjs'
import React from 'react'

import { SessionItem } from './SessionItem'

export const SessionList = () => {
  const user = useUser()
  const session = useSession()

  // userSessions is a list of all sessions for the user
  const [userSessions, setUserSessions] = React.useState(null)

  React.useEffect(() => {
    user.getSessions().then((userSessions) => {
      userSessions.sort((x, y) => y.expireAt.getTime() - x.expireAt.getTime())
      userSessions.reverse()
      setUserSessions(userSessions)
    })
  }, [user])

  if (!userSessions) {
    return null
  }

  return (
    <>
      {userSessions.map((userSession, index) => (
        <SessionItem
          key={userSession.id}
          userSession={userSession}
          index={index}
        />
      ))}
      {userSessions.length === 1 && <SessionCover />}
    </>
  )
}

const SessionCover = () => {
  const user = useUser()

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden relative mb-4">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Device #2
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
        <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center">
          <p className="text-base font-semibold mb-3 text-center">
            Sign in to{' '}
            {window.location.origin.substring(
              window.location.protocol.length + 2
            )}{' '}
            on
            <br />
            another device and refresh
          </p>
          <button
            id="refresh_btn"
            type="button"
            onClick={() => user.update({})}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}
