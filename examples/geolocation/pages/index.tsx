import Head from 'next/head'
import Image from 'next/image'

// Forward properties from `_middleware.tsx`
// When support for configuring gSSP to use Edge Functions lands,
// We could add that logic here directly.
export const getServerSideProps = ({ query }) => ({
  props: query,
})

export default function Index({
  name,
  languages,
  flag,
  city,
  region,
  country,
  currencyCode,
  currencySymbol,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Head>
        <title>Geolocation Example – Vercel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="fixed h-screen w-screen overflow-hidden opacity-75 max-h-[900px]">
        <Image
          alt="World Map"
          src="/map.svg"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center z-10 pt-8 sm:pt-0">
        <h1 className="text-3xl sm:text-5xl font-bold">Geolocation</h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700">
          Show localized content based on headers
        </p>
        <a
          className="flex items-center mt-4 text-md sm:text-lg text-blue-500 hover:underline"
          href="https://vercel.com/docs/edge-network/headers#request-headers?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Documentation
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            className="ml-1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
        <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full hover:shadow-2xl transition">
          <div className="p-4 flex justify-center items-between border-b">
            <div className="self-center">
              <Image
                alt={`${country} flag`}
                className="rounded-full"
                src={flag}
                width={32}
                height={32}
              />
            </div>
            <div className="ml-4 mr-auto text-left">
              <h4 className="font-semibold">{name}</h4>
              <h5 className="text-gray-700">{city}</h5>
            </div>
            <p className="self-center text-gray-700">{country}</p>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">Languages</h4>
            <div className="self-center">
              <p className="text-gray-700">{languages}</p>
            </div>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">Currency</h4>
            <p className="text-gray-700">{`${currencyCode} ${currencySymbol}`}</p>
          </div>
          <div className="p-4 flexborder-b bg-gray-50 rounded-b-lg">
            <h4 className="font-semibold text-left">Geolocation Headers</h4>
            <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg mt-4 text-sm leading-6">
              <p>
                <strong>{'x-vercel-ip-city: '}</strong>
                {city}
              </p>
              <p>
                <strong>{'x-vercel-ip-country-region: '}</strong>
                {region}
              </p>
              <p>
                <strong>{'x-vercel-ip-country: '}</strong>
                {country}
              </p>
            </pre>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center w-full h-24 z-10">
        <a
          className="flex items-center justify-center text-gray-700"
          href="https://vercel.com?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
