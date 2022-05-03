import Head from 'next/head'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import LoadingDots from '../components/loading-dots'
import toast, { Toaster } from 'react-hot-toast'
import useSWR, { mutate } from 'swr'
import Image from 'next/image'

const fetcher = async (...args) => {
  const res = await fetch(...args)
  const json = await res.json()
  if (res.status === 200) {
    return json
  } else {
    const error = new Error(`${res.status}: ${json.error.message}`)
    error.error = json.error
    throw error
  }
  return res.json()
}

export default function Home() {
  const [domain, setDomain] = useState('')

  const { data: domainList = [], mutate: revalidateDomains } = useSWR(`/api/get-domains`, fetcher)
  const [disabled, setDisabled] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (domain.length == 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [domain])

  useEffect(() => {
    if (adding) setDisabled(true)
  }, [adding])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Domains API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 10000,
        }}
      />
      <a
        href="https://github.com/vercel/examples/tree/main/solutions/domains-api"
        target="_blank"
        rel="noreferrer"
        className="fixed top-5 right-5"
      >
        <Image src="/github.svg" alt="Github" width={25} height={25} />
      </a>

      <main className="flex flex-col items-center justify-center w-full flex-1 sm:px-20 text-center my-20">
        <h1 className="text-4xl sm:text-6xl font-bold">Domains API</h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setAdding(true)
            try {
              await fetch(`/api/add-domain?domain=${domain}`)
              await revalidateDomains()
            } catch (error) {
              alert(error.message)
            } finally {
              setAdding(false)
            }
          }}
          className="flex justify-between space-x-4 px-5 w-full max-w-2xl h-10 mt-10"
        >
          <input
            type="text"
            name="domain"
            onInput={(e) => {
              setDomain(e.target.value)
            }}
            autoComplete="off"
            placeholder="mydomain.com"
            pattern="^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
            required
            className="rounded-md border border-gray-300 focus:ring-0 focus:border-black px-4 flex-auto min-w-0 sm:text-sm"
          />
          <button
            type="submit"
            disabled={disabled}
            className={`${
              disabled
                ? 'cursor-not-allowed bg-gray-100 text-gray-500 border-gray-300'
                : 'bg-black text-white border-black hover:text-black hover:bg-white'
            } py-2 w-28 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
            {adding ? <LoadingDots /> : 'Add'}
          </button>
        </form>

        {error && (
          <div className="text-red-500 text-left w-full max-w-2xl mt-5 text-sm flex items-center space-x-2">
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
              style={{ color: '#f44336' }}
            >
              <circle cx="12" cy="12" r="10" fill="white" />
              <path d="M12 8v4" stroke="#f44336" />
              <path d="M12 16h.01" stroke="#f44336" />
            </svg>
            <p>
                Cannot add <b>{error.domain}</b> since it&apos;s already
                assigned to another project.
              </p>
          </div>
        )}

        <div className="w-full max-w-2xl">
          {domainList.map((domain, index) => {
            return (
              <DomainCard
                key={index}
                domain={domain.name}
                revalidateDomains={revalidateDomains}
              />
            )
          })}
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noreferrer"
        >
          Powered by{' '}
          <div className="flex ml-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={71} height={16} />
          </div>
        </a>
      </footer>
    </div>
  )
}

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

const ConfiguredSection = ({ domainInfo }) => {
  const [recordType, setRecordType] = useState('CNAME')
  if (!domainInfo) {
    return (
      <div className="flex items-center space-x-3 my-3 px-2 sm:px-10">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        >
          <circle cx="12" cy="12" r="10" fill="grey" />
        </svg>
        <p
          className={`text-black text-gray-500 font-normal text-sm`}
        >
          Loading Configuration
        </p>
      </div>
    )
  }

  if (!domainInfo.verified) {
    const txtVerification = domainInfo.verification.find(x => x.type === 'TXT')
    return (
      <>
        <div className="flex items-center space-x-3 my-3 px-2 sm:px-10">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
          >
            <circle cx="12" cy="12" r="10" fill="#d32f2f" />
              <>
                <path d="M15 9l-6 6" stroke="white" />
                <path d="M9 9l6 6" stroke="white" />
              </>
          </svg>
          <p
            className={`text-red-700 font-medium text-sm`}
          >
            Domain is pending verification
          </p>
        </div>

        <div className="w-full border-t border-gray-100 mt-5 mb-8" />

        <div className="px-2 sm:px-10">
          <div className="flex justify-start space-x-4">
            <div
              onClick={() => setRecordType('CNAME')}
              className={`${
                recordType == 'CNAME'
                  ? 'text-black border-black'
                  : 'text-gray-400 border-white'
              } text-sm border-b-2 pb-1 transition-all ease duration-150`}
            >
              Verify Domain Ownership
            </div>
          </div>
          <div className="my-3 text-left">
            <p className="my-5 text-sm">
              Please set the following TXT record on {domainInfo.apexName} to prove ownership of {domainInfo.name}:
            </p>
            <div className="flex justify-start items-start space-x-10 bg-gray-50 p-2 rounded-md">
              <div>
                <p className="text-sm font-bold">Type</p>
                <p className="text-sm font-mono mt-2">{txtVerification.type}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Name</p>
                <p className="text-sm font-mono mt-2">
                  {txtVerification.domain.slice(0, txtVerification.domain.length - domainInfo.apexName.length - 1)}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold">Value</p>
                <p className="text-sm font-mono mt-2">
                  <span className='text-ellipsis'>
                  {txtVerification.value}
                  </span>
                </p>
              </div>
            </div>
            {getVerificationError(domainInfo.verificationResponse) && <p className="my-5 text-sm text-red-700">
              {getVerificationError(domainInfo.verificationResponse)}
            </p>}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-3 my-3 px-2 sm:px-10">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        >
          <circle cx="12" cy="12" r="10" fill={domainInfo.configured ? '#1976d2' : '#d32f2f'} />
          {domainInfo.configured ? (
            <>
              <path
                d="M8 11.8571L10.5 14.3572L15.8572 9"
                fill="none"
                stroke="white"
              />
            </>
          ) : (
            <>
              <path d="M15 9l-6 6" stroke="white" />
              <path d="M9 9l6 6" stroke="white" />
            </>
          )}
        </svg>
        <p
          className={`${
            domainInfo.configured ? 'text-black font-normal' : 'text-red-700 font-medium'
          } text-sm`}
        >
          {domainInfo.configured ? 'Valid' : 'Invalid'} Configuration
        </p>
      </div>

      {!domainInfo.configured && (
        <>
          <div className="w-full border-t border-gray-100 mt-5 mb-8" />

          <div className="px-2 sm:px-10">
            <div className="flex justify-start space-x-4">
              <button
                onClick={() => setRecordType('CNAME')}
                className={`${
                  recordType == 'CNAME'
                    ? 'text-black border-black'
                    : 'text-gray-400 border-white'
                } text-sm border-b-2 pb-1 transition-all ease duration-150`}
              >
                CNAME Record (subdomains)
              </button>
              <button
                onClick={() => setRecordType('A')}
                className={`${
                  recordType == 'A'
                    ? 'text-black border-black'
                    : 'text-gray-400 border-white'
                } text-sm border-b-2 pb-1 transition-all ease duration-150`}
              >
                A Record (apex domain)
              </button>
            </div>
            <div className="my-3 text-left">
              <p className="my-5 text-sm">
                Set the following record on your DNS provider to continue:
              </p>
              <div className="flex justify-start items-center space-x-10 bg-gray-50 p-2 rounded-md">
                <div>
                  <p className="text-sm font-bold">Type</p>
                  <p className="text-sm font-mono mt-2">{recordType}</p>
                </div>
                <div>
                  <p className="text-sm font-bold">Name</p>
                  <p className="text-sm font-mono mt-2">
                    {recordType == 'CNAME' ? 'www' : '@'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold">Value</p>
                  <p className="text-sm font-mono mt-2">
                    {recordType == 'CNAME'
                      ? `cname.platformize.co`
                      : `76.76.21.21`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function getVerificationError(verificationResponse) {
  try {
    const error = verificationResponse.error
    if (error.code === "missing_txt_record") {
      return null
    }
    return error.message
  } catch {
    return null
  }
}