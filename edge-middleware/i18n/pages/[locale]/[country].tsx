import type { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import type { ParsedUrlQuery } from 'querystring'
import { Layout } from '@vercel/examples-ui'
import { Dictionary } from '../../lib/types'
import map from '../../public/map.svg'
import api from '../../lib/api'

interface Params extends ParsedUrlQuery {
  country: string
}

interface Props {
  country: string
  locale: string
  dictionary: Dictionary
}

export const getStaticPaths: GetStaticPaths = async () => {
  // We don't want to specify all possible countries as we get those from the headers
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<unknown, Params> = async ({
  params: { country, locale },
}) => {
  // Get dictionary
  const dictionary = await api.dictionaries.fetch(locale)

  return {
    props: {
      country,
      dictionary,
      locale,
    },
    revalidate: false,
  }
}

export default function CountryPage({ country, locale, dictionary }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="fixed inset-0 overflow-hidden opacity-75 bg-[#f8fafb]">
        <Image
          alt="World Map"
          src={map}
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center z-10 pt-8 sm:pt-20">
        <header className="mb-12 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-5xl font-bold">{dictionary.title}</h1>
          <p className="mt-4 sm:text-xl text-lg text-gray-700">
            {dictionary.subtitle}
          </p>
          <a
            className="flex items-center mt-4 text-md sm:text-lg text-blue-500 hover:underline"
            href="https://vercel.com/docs/edge-network/headers#request-headers?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
            target="_blank"
            rel="noreferrer"
          >
            {dictionary.link}
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
        </header>
        <div className="h-[96px] w-[128px] -mb-28 z-10">
          <Image
            alt="Country flag"
            width={128}
            height={96}
            src={`/flags/${country.toLowerCase()}.svg`}
            layout="fixed"
          />
        </div>
        <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full max-w-[480px] hover:shadow-2xl transition pt-12">
          <div className="p-4 flex flex-col justify-center items-center border-b text-lg italic">
            {dictionary.greet}
          </div>
          <div className="p-4">
            <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
              <p>
                <strong>{'locale: '}</strong> {locale}
              </p>
            </pre>
          </div>
        </section>
      </main>
    </div>
  )
}

CountryPage.Layout = Layout
