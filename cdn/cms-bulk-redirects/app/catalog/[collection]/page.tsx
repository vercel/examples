import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Page, Text, Code, Button } from '@vercel/examples-ui'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { collections, getCollection, getCollectionParams } from '../../../lib/collections'

export async function generateStaticParams() {
  return getCollectionParams()
}

export default function CollectionPage({ params }: { params: { collection: string } }) {
  const collection = getCollection(params.collection)

  if (!collection) return notFound()

  return (
    <Page className="flex flex-col gap-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to overview
      </Link>

      <div className="surface rounded-3xl p-8">
        <div className={`rounded-2xl bg-gradient-to-br ${collection.accent} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Text variant="h1">
                {collection.title}
              </Text>
              <Text className="text-slate-700 max-w-3xl">{collection.description}</Text>
            </div>
            <div className="pill rounded-full px-4 py-2 text-sm text-slate-700">
              Status: {collection.status}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur">
              <Text variant="h2">
                Redirected paths
              </Text>
              <Text className="text-slate-700">
                These are the legacy or vanity URLs your content team can manage in Contentful.
              </Text>
              <div className="mt-4 flex flex-wrap gap-3">
                {collection.incomingPaths.map((path) => (
                  <span key={path} className="pill rounded-full px-3 py-1 text-sm text-slate-800">
                    <Code>{path}</Code>
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur">
              <Text variant="h2">
                Why redirects matter here
              </Text>
              <ul className="mt-4 space-y-2 text-slate-700">
                {collection.highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <Text variant="h2">
                Merch lineup
              </Text>
              <Button variant="secondary" href="/">
                Go back to all collections
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {collection.products.map((product) => (
                <div key={product.name} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="pill rounded-full px-3 py-1 text-xs text-slate-800">
                      {product.price}
                    </span>
                    {product.badge && (
                      <span className="pill rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-slate-900">{product.name}</div>
                  <p className="text-sm text-slate-700">{product.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="surface rounded-2xl p-6">
        <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
          <Text variant="h2">
            Tip: publish redirects without touching code
          </Text>
          <Text className="text-slate-700">
            If marketing wants to rotate <Code>/catalog/latest</Code> to a new launch, they just update the redirect
            entry in Contentful. The next deploy regenerates the bulk file, and Vercel ships it with zero app changes.
          </Text>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="pill rounded-full px-3 py-1">Bulk redirects &gt; middleware</span>
            <span className="pill rounded-full px-3 py-1">Static Next.js output</span>
            <span className="pill rounded-full px-3 py-1">CMS-owned URLs</span>
          </div>
        </div>
      </section>
    </Page>
  )
}
