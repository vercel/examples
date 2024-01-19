import Link from 'next/link'

export default function Component() {
  return (
    <>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Redirecting links</h2>
        <div className="flex flex-col gap-2">
          <LinkInstance
            href="/blog/should-redirect-to-google"
            label="Should redirect to Google"
          />
          <LinkInstance
            href="/blog/should-redirect-to-yahoo"
            label="Should redirect to Yahoo"
          />
          <LinkInstance
            href="/blog/should-redirect-to-1"
            label="Should redirect to Google with query string 1"
          />
          <LinkInstance
            href="/blog/should-redirect-to-1000"
            label="Should redirect to Google with query string 1000"
          />
          <LinkInstance
            href="/blog/should-redirect-to-9999"
            label="Should redirect to Google with query string 9999"
          />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Regular Links</h2>
        <div className="flex flex-col gap-2">
          <LinkInstance
            href="/blog/should-render-basic-blog-post"
            label="Should render basic blog post"
          />
        </div>
      </section>
    </>
  )
}

function LinkInstance({ href, label }: { href: string; label: string }) {
  return (
    <>
      <Link className="flex items-center gap-2" href={href}>
        <IconHome className="w-6 h-6 text-gray-900 dark:text-gray-50" />
        <span className="text-gray-900 dark:text-gray-50">
          {label} (Soft navigation)
        </span>
      </Link>
      <a className="flex items-center gap-2" href={href} target="_blank">
        <IconHome className="w-6 h-6 text-gray-900 dark:text-gray-50" />
        <span className="text-gray-900 dark:text-gray-50">
          {label} (New window)
        </span>
      </a>
    </>
  )
}

function IconHome({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
