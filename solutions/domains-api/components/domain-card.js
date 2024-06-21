import ConfiguredSection from './configured-section'
import useSWR, { mutate } from 'swr'
import fetcher from '../lib/fetcher'
import { useState } from 'react'
import LoadingDots from '../components/loading-dots'
import { restrictedDomains } from '../lib/consts'

const DomainCard = ({ domain, revalidateDomains }) => {
  const { data: domainInfo, isValidating } = useSWR(
    `/api/check-domain?domain=${domain}`,
    fetcher,
    { revalidateOnMount: true, refreshInterval: 5000 }
  )
  const [removing, setRemoving] = useState(false)
  return (
    <div className="w-full shadow-md border-y border border-gray-50 rounded-lg mt-10">
      <div className="flex flex-col gap-4 md:flex-row p-6 pb-0">
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
        <button
          onClick={() => {
            mutate(`/api/check-domain?domain=${domain}`)
          }}
          disabled={isValidating}
          className={`${
            isValidating
              ? 'cursor-not-allowed bg-gray-100'
              : 'bg-white hover:text-black hover:border-black'
          } text-gray-500 border-gray-200 py-1.5 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150 w-full md:w-24 ml-auto`}
        >
          {isValidating ? <LoadingDots /> : 'Refresh'}
        </button>
        {!restrictedDomains.includes(domain) ? (
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
              removing ? 'cursor-not-allowed' : ''
            } bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150 w-full md:w-24`}
          >
            {removing ? <LoadingDots /> : 'Remove'}
          </button>
        ) : null}
      </div>

      <ConfiguredSection domainInfo={domainInfo} />
    </div>
  )
}

export default DomainCard
