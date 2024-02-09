import { searchPokedex } from '@/app/actions'
import ExpandingArrow from '@/components/expanding-arrow'
import { Search } from '@/components/search'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Link
        href="https://vercel.com/templates/next.js/postgres-pgvector"
        className="group rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
      >
        <p>Deploy your own to Vercel</p>
        <ExpandingArrow />
      </Link>
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Postgres on Vercel
      </h1>
      <div className="bg-white/30 p-6 lg:p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              Search the Pokédex, semantically
            </h2>
            <p className="text-sm text-gray-500 leading-5">
              Try &quot;electric&quot; or &quot;fire&quot; or &quot;lizard&quot;
              or &quot;cat.&quot; Cosine similarity is used to find the most
              similar Pokémon.
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-900/5">
          <Search searchPokedex={searchPokedex} />
        </div>
      </div>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
        <Link
          href="https://vercel.com/postgres"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Vercel Postgres
        </Link>{' '}
        semantic search demo with{' '}
        <Link
          href="https://github.com/pgvector/pgvector-node#prisma"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          pgvector
        </Link>
        ,{' '}
        <Link
          href="https://prisma.io"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Prisma
        </Link>
        , and{' '}
        <Link
          href="https://platform.openai.com/docs/guides/embeddings"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          OpenAI
        </Link>
        . Built with{' '}
        <Link
          href="https://nextjs.org/docs"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Next.js App Router
        </Link>
        .
      </p>
      <div className="mt-12 w-full flex items-center justify-between px-6 ">
        <Link
          href="https://vercel.com"
          className="block lg:absolute bottom-12 left-12"
        >
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href="https://github.com/vercel/examples/tree/main/storage/postgres-pgvector"
          className="lg:absolute bottom-12 right-12 flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <span className="font-light">Source</span>
        </Link>
      </div>
    </main>
  )
}
