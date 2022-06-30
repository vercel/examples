import React from 'react'
import { useForceRender } from 'utils/forceRender'
import { parseClaims, parseToken } from 'utils/token'

// We must hardcode the classnames
// otherwise they will be purged by purgeCss during prod build
const getBarColorForPercentage = (p) => {
  return p < 50
    ? 'bg-green-500'
    : p < 60
    ? 'bg-yellow-300'
    : p < 70
    ? 'bg-yellow-400'
    : p < 80
    ? 'bg-yellow-500'
    : p < 90
    ? 'bg-yellow-600'
    : 'bg-red-600'
}

const getTextColorForPercentage = (p) => {
  return p < 50
    ? 'text-green-500'
    : p < 60
    ? 'text-yellow-300'
    : p < 70
    ? 'text-yellow-400'
    : p < 80
    ? 'text-yellow-500'
    : p < 90
    ? 'text-yellow-600'
    : 'text-red-600'
}

const useForceRenderWhileValid = (ttl) => {
  const { stop } = useForceRender()
  if (ttl === 0) {
    stop()
  }
}

export const TokenCard = ({ token, index, total }) => {
  const { totalValidForSec, timeToLiveInSec, issuedAt } = parseClaims(
    parseToken(token)
  )
  useForceRenderWhileValid(timeToLiveInSec)
  const percentGone = 100 - (100 * timeToLiveInSec) / totalValidForSec

  const barColor = getBarColorForPercentage(percentGone)
  const textColor = getTextColorForPercentage(percentGone)

  return (
    <div className="p-2 text-left">
      <div className="shadow rounded-lg bg-white">
        <div className="px-7 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            JWT #{total - index}{' '}
            {index === 0 && (
              <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                Currently active
              </span>
            )}
          </h3>
        </div>
        <div
          className={`h-1 transition-all ease-linear duration-1000 ${barColor}`}
          style={{ width: `${percentGone}%` }}
        />
        <div className="px-7 py-5">
          <dl className="flex justify-between">
            <div>
              <dt className="text-sm font-medium text-gray-500">Issued At</dt>
              <dd className="mt-1 text-base sm:text-2xl text-gray-900">
                {new Date(issuedAt * 1000).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-right text-sm font-medium text-gray-500">
                Expires In
              </dt>
              <dd
                className={`text-right mt-1 text-base sm:text-2xl text-gray-900 ${textColor}`}
              >
                {percentGone === 100 ? 'Expired' : `${timeToLiveInSec} seconds`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
