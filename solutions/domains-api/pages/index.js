import Head from 'next/head'
import { useEffect, useState } from 'react'
import LoadingDots from '../components/loading-dots'
import toast, { Toaster } from 'react-hot-toast'
import useSWR from 'swr'
import Image from 'next/image'
import DomainCard from '../components/domain-card'
import fetcher from '../lib/fetcher'
import DomainCardPlaceholder from '../components/domain-card-placeholder'

export default function Home() {
  const [domain, setDomain] = useState('')

  const { data: domainList, mutate: revalidateDomains } = useSWR(
    `/api/get-domains`,
    fetcher
  )
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
              Cannot add <b>{error.domain}</b> since it&apos;s already assigned
              to another project.
            </p>
          </div>
        )}

        <div className="w-full max-w-2xl">
          {domainList
            ? domainList.map((domain, index) => {
                return (
                  <DomainCard
                    key={index}
                    domain={domain.name}
                    revalidateDomains={revalidateDomains}
                  />
                )
              })
            : [1, 2, 3, 4, 5].map((_, index) => {
                return <DomainCardPlaceholder key={index} />
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
