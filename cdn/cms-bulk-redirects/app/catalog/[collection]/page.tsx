import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollection, getCollectionParams } from '../../../lib/collections'

export async function generateStaticParams() {
  return getCollectionParams()
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionSlug } = await params
  const collection = getCollection(collectionSlug)

  if (!collection) return notFound()

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-500">
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
              Home
            </Link>
            {' '}/{' '}
            <span className="text-black dark:text-white">{collection.title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
                {collection.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                {collection.description}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
              {collection.status}
            </span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
            Products
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.products.map((product) => (
              <div
                key={product.name}
                className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-black dark:hover:border-white transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {product.name}
                  </h3>
                  {product.badge && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-black dark:bg-white text-white dark:text-black">
                      {product.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {product.tagline}
                </p>
                <div className="text-xl font-bold text-black dark:text-white">
                  {product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back */}
      <section className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            ← Back to all collections
          </Link>
        </div>
      </section>
    </main>
  )
}
