import React from 'react'
import { ClerkLoading, SignedIn, SignedOut, useClerk } from '@clerk/nextjs'
import { getVercelRegion } from 'utils/vercelRegion'
import { SignInCover } from 'utils/buttons'
import { Result } from './Result'

export const Requester = ({
  hidden,
  order,
  path,
  label,
  badge,
  description,
  labelColor,
  buttonId,
  buttonColor,
  buttonBgColor,
  buttonBgColorFocus,
  buttonBgColorHover,
}) => {
  const [result, setResult] = React.useState(null)

  return (
    <>
      <div className={`${hidden ? 'hidden' : ''} sm:block ${order[0]}`}>
        <div className="flex items-center">
          <h2 className={`${labelColor} text-2xl font-semibold mr-2`}>
            {label}
          </h2>
          {badge}
        </div>
        <p className="mt-1 text-gray-500">{description}</p>
      </div>
      <div
        className={`${hidden ? 'hidden' : ''} sm:block ${
          order[1]
        } mt-4 bg-white shadow rounded-lg overflow-hidden`}
      >
        <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {label} demo
            </h3>
          </div>
          <div className="shrink-0">
            <SignedIn>
              <RequestButton
                path={path}
                setResult={setResult}
                buttonId={buttonId}
                buttonColor={buttonColor}
                buttonBgColor={buttonBgColor}
                buttonBgColorHover={buttonBgColorHover}
                buttonBgColorFocus={buttonBgColorFocus}
              />
            </SignedIn>
            <SignedOut>
              <div style={{ height: '34px' }} />
            </SignedOut>
            <ClerkLoading>
              {/* This is a shim to prevent layout shift */}
              <div style={{ height: '34px' }} />
            </ClerkLoading>
          </div>
        </div>

        <div className="px-4 py-3 relative">
          <Result result={result} />
          <SignedOut>
            <SignInCover id={`${buttonId}_signup`}>
              Sign in to test {label.toLowerCase()} latency
            </SignInCover>
          </SignedOut>
        </div>
      </div>
    </>
  )
}

export const RequestButton = ({
  path,
  setResult,
  buttonId,
  buttonColor,
  buttonBgColor,
  buttonBgColorHover,
  buttonBgColorFocus,
}) => {
  const { setSession } = useClerk()

  const makeRequest = async () => {
    const start = new Date().getTime()
    const response = await fetch(path, {
      method: 'GET',
    })

    if (response.status === 200) {
      const responseTime = new Date().getTime() - start
      const data = await response.json()
      setResult({
        responseTime: responseTime,
        responseRegion: getVercelRegion(response.headers.get('x-vercel-id')),
        ...data,
      })
    } else if (response.status === 403) {
      setSession(null)
    }
  }

  return (
    <button
      id={buttonId}
      onClick={makeRequest}
      type="button"
      className={`relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow ${buttonColor} ${buttonBgColor} hover:${buttonBgColorHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${buttonBgColorFocus}`}
    >
      Try it
    </button>
  )
}
