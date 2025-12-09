import Link from 'next/link'
import { Page, Text, Code, Button } from '@vercel/examples-ui'
import Image from 'next/image'
import { ArrowUpRightIcon, LinkIcon } from '@heroicons/react/24/outline'
import redirects from '../generated-redirects.json'
import { collections } from '../lib/collections'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="surface rounded-2xl p-8 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 pill rounded-full px-3 py-1 text-sm text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              E-commerce redirects · Contentful + vercel.ts
            </div>
            <Text variant="h1" className="text-4xl sm:text-5xl">
              Keep seasonal URLs alive, even when products rotate
            </Text>
            <Text className="text-lg text-slate-700">
              Merch teams retire SKUs, swap in new collections, and keep running campaigns. Redirect entries in
              Contentful flow into Vercel bulk redirects during the build—no middleware, no custom code.
            </Text>
            <div className="flex flex-wrap gap-3">
              <Button href="/catalog/fall-2025">View live catalog</Button>
              <Button href="/api/redirects" variant="secondary">
                See the redirect file
              </Button>
            </div>
            <a
              className="inline-flex w-fit items-center justify-center overflow-hidden rounded-lg border border-slate-200 shadow-sm"
              href="https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cms-bulk-redirects&project-name=cms-bulk-redirects&repository-name=cms-bulk-redirects&env=CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN"
              target="_blank"
              rel="noreferrer"
            >
              <Image src="https://vercel.com/button" alt="Deploy with Vercel" width={160} height={40} />
            </a>
            <ul className="mt-4 grid gap-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Marketing owns vanity URLs like <Code>/catalog/fall</Code> and <Code>/catalog/latest</Code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Redirects publish with the deploy—no app change or middleware to maintain.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Great for rotating collections, discontinued SKUs, and evergreen campaign links.</span>
              </li>
            </ul>
          </div>
          <div className="surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Redirect rules from Contentful</span>
              <Link
                href="https://www.contentful.com/"
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800"
              >
                Model <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {redirects.map((redirect, idx) => (
                <div key={`${redirect.source}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <LinkIcon className="h-4 w-4" />
                    Contentful entry
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {redirect.source} <ArrowUpRightIcon className="inline h-4 w-4 text-slate-400" /> {redirect.destination}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {redirect.permanent ? '308 / permanent' : redirect.statusCode ? `Status: ${redirect.statusCode}` : 'Temporary'}
                    {redirect.query ? ' · preserves query' : ''}
                    {redirect.caseSensitive ? ' · case sensitive' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <Text variant="h2">Collections your redirects point to</Text>
          <Text className="text-slate-700">
            Send legacy traffic to the right collection page without touching the app. Each card is the redirect target.
          </Text>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/catalog/${collection.slug}`}
              className="surface group relative block overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`absolute inset-0 opacity-70 blur-2xl bg-gradient-to-br ${collection.accent}`} />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
                    Status: {collection.status}
                  </span>
                  <ArrowUpRightIcon className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <Text className="text-xl font-semibold text-slate-900">{collection.title}</Text>
                  <Text className="text-slate-700">{collection.description}</Text>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">Redirected paths</div>
                  <div className="flex flex-wrap gap-2">
                    {collection.incomingPaths.map((path) => (
                      <span key={path} className="pill rounded-full px-3 py-1">
                        <Code>{path}</Code>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface rounded-2xl p-6 md:p-8 space-y-4">
        <Text variant="h2">How this ships</Text>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-800">1) Contentful owns the routes</div>
            <p className="text-sm text-slate-700 mt-1">
              Marketing edits redirect entries in Contentful, including status codes and query behavior.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-800">2) vercel.ts writes the file</div>
            <p className="text-sm text-slate-700 mt-1">
              Build step fetches entries and saves <Code>generated-redirects.json</Code>. This repo also ships a sample file.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-800">3) Vercel publishes bulk redirects</div>
            <p className="text-sm text-slate-700 mt-1">
              The config uses <Code>bulkRedirectsPath</Code>, so your storefront stays static and cache-friendly.
            </p>
          </div>
        </div>
      </section>
    </Page>
  )
}
