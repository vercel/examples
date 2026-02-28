'use client'

import { useEffect, useState } from 'react'

const DEEP_LINK =
  'https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fcdn%2Frouting%2Fnew%3Froute%3D%257B%2522name%2522%253A%2522Blog%2520API%2520Proxy%2522%252C%2522description%2522%253A%2522Proxy%2520%252Fapi%252Fexternal%2520to%2520blog%2520API%2520with%2520CDN%2520caching%2522%252C%2522path%2522%253A%2522%252Fapi%252Fexternal%252F%253Apath*%2522%252C%2522syntax%2522%253A%2522path-to-regexp%2522%252C%2522actions%2522%253A%255B%257B%2522type%2522%253A%2522rewrite%2522%252C%2522dest%2522%253A%2522https%253A%252F%252Fjsonplaceholder.typicode.com%252F%25241%2522%257D%252C%257B%2522type%2522%253A%2522modify%2522%252C%2522subType%2522%253A%2522response-headers%2522%252C%2522headers%2522%253A%255B%257B%2522op%2522%253A%2522set%2522%252C%2522key%2522%253A%2522CDN-Cache-Control%2522%252C%2522value%2522%253A%2522public%252C%2520max-age%253D60%252C%2520stale-while-revalidate%253D3600%2522%257D%252C%257B%2522op%2522%253A%2522set%2522%252C%2522key%2522%253A%2522Vercel-Cache-Tag%2522%252C%2522value%2522%253A%2522api%2522%257D%255D%257D%255D%257D&title=Add%20Blog%20API%20Proxy%20Route'

type Post = {
  id: number
  title: string
  body: string
  userId: number
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 dark:bg-gray-900 rounded w-full mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-900 rounded w-5/6 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-900 rounded w-2/3" />
    </div>
  )
}

function Onboarding() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Connect your blog API
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            This page fetches posts from{' '}
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">/api/external/posts</code>
            , which is proxied to your backend via a{' '}
            <a
              href="https://vercel.com/docs/routing/project-routing-rules"
              className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2"
            >
              Vercel project route
            </a>
            . Once configured, posts will appear here automatically.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-5 uppercase tracking-wider">
            Set up in 2 minutes
          </h2>
          <ol className="space-y-5">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">1</span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Open your project in the Vercel Dashboard</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Navigate to <strong className="text-gray-700 dark:text-gray-300">CDN</strong> &rarr; <strong className="text-gray-700 dark:text-gray-300">Routing</strong>
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Create a rewrite route</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">/api/external/:path*</code>
                  {' '}&rarr;{' '}your API URL
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Test and publish</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Preview with the staging alias, then publish to production</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <a href={DEEP_LINK} className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm">
            Add Route in Dashboard
          </a>
          <div className="flex gap-3">
            <a href="https://vercel.com/docs/routing/project-routing-rules" className="flex-1 inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm">
              View Docs
            </a>
            <a href="https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite#in-code-alternative-approach" className="flex-1 inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm">
              Use vercel.ts instead
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            <strong className="text-gray-600 dark:text-gray-400">Running locally?</strong>{' '}
            Project routes only work on Vercel&apos;s CDN. In local development,
            you&apos;ll always see this page. Deploy to Vercel and add the route
            to see it in action.
          </p>
        </div>
      </div>
    </main>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-2">Post #{post.id}</p>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 leading-snug capitalize">{post.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{post.body}</p>
    </div>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/external/posts')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.json()
      })
      .then((data) => {
        setPosts(data.slice(0, 9))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (error) return <Onboarding />

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-2 tracking-wide uppercase">Blog</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Latest posts</h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Proxied via CDN
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : posts?.map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        {!loading && posts && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fetched from{' '}
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">/api/external/posts</code>
              {' '}&rarr;{' '}proxied to your API via a{' '}
              <a href="https://vercel.com/docs/routing/project-routing-rules" className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2">
                project route
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
