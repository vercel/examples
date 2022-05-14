import ConfiguredSection from './configured-section'
import useSWR, { mutate } from 'swr'
import fetcher from '../lib/fetcher'
import { useState } from 'react'
import LoadingDots from '../components/loading-dots'

const DomainCard = ({ domain, revalidateDomains }) => {
  const { data: domainInfo, isValidating } = useSWR(
    `/api/check-domain?domain=${domain}`,
    fetcher,
    { revalidateOnMount: true, refreshInterval: 5000 }
  )
  const [removing, setRemoving] = useState(false)
  return (
    <div className="w-full mt-10 sm:shadow-md border-y sm:border border-black sm:border-gray-50 sm:rounded-lg py-10">
      <div className="flex justify-between space-x-4 px-2 sm:px-10">
        <a
          href={`http://${domain}`}
          target="_blank"
          rel="noreferrer"
          className="text-xl text-left font-semibold flex items-center"
        >
          {domain}
          <span className="inline-block ml-2">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </span>
        </a>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              mutate(`/api/check-domain?domain=${domain}`)
            }}
            disabled={isValidating}
            className={`${
              isValidating
                ? 'cursor-not-allowed bg-gray-100'
                : 'bg-white hover:text-black hover:border-black'
            } text-gray-500 border-gray-200 py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
            {isValidating ? <LoadingDots /> : 'Refresh'}
          </button>
          <button
            onClick={async () => {
              setRemoving(true)
              try {
                await fetch(`/api/remove-domain?domain=${domain}`)
                await revalidateDomains()
              } catch (error) {
                alert(`Error removing domain`)
              } finally {
                setRemoving(false)
              }
            }}
            disabled={removing}
            className={`${
              removing ? 'cursor-not-allowed bg-gray-100' : ''
            }bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
            {removing ? <LoadingDots /> : 'Remove'}
          </button>
        </div>
      </div>

      <ConfiguredSection domainInfo={domainInfo} />
    </div>
  )
}

export default DomainCard
