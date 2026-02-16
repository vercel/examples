import Link from 'next/link'
import { Main } from '@/components/main'

// Demo-only setup page:
// this route exists to guide users through configuring the example quickly.
const REQUIRED_FLAGS = [
  {
    key: 'summer-sale',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show/hide the summer sale banner.',
  },
  {
    key: 'free-delivery',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show/hide the free delivery banner.',
  },
  {
    key: 'proceed-to-checkout-color',
    type: 'string',
    defaultValue: 'blue',
    description: 'Color used for the proceed-to-checkout button.',
  },
] as const

function StatusPill({ ready }: { ready: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        ready ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      {ready ? 'Configured' : 'Missing'}
    </span>
  )
}

export default function SetupPage() {
  // Demo-only signal check for this template.
  const hasFlags = Boolean(process.env.FLAGS)
  const hasFlagsSecret = Boolean(process.env.FLAGS_SECRET)

  return (
    <Main>
      <div className="mx-auto max-w-4xl space-y-12 mt-24">
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Setup Required
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Finish Vercel Flags setup
          </h1>
          <p className="mt-3 text-gray-600">
            This template rewrites traffic to a setup page until required
            environment variables are configured.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5">
              <code className="text-sm">FLAGS</code>
              <StatusPill ready={hasFlags} />
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5">
              <code className="text-sm">FLAGS_SECRET</code>
              <StatusPill ready={hasFlagsSecret} />
            </div>
          </div>
        </section>

        <section>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex shrink-0 justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xl font-semibold text-gray-700">
                  1
                </div>
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-semibold tracking-tight text-black">
                  Create flags in your project
                </h3>
                <p className="mt-1 text-gray-600 text-sm">
                  Open your Vercel project, go to the Flags tab, and create the
                  exact flag keys listed below.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex shrink-0 justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xl font-semibold text-gray-700">
                  2
                </div>
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-semibold tracking-tight text-black">
                  Pull environment variables
                </h3>
                <p className="mt-1 text-gray-600 text-sm">
                  Run <code>vercel env pull</code> so your local app gets{' '}
                  <code>FLAGS</code>.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="https://vercel.com/docs/flags/vercel-flags?utm_source=vercel-examples"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/85"
            >
              Vercel Flags Docs
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">Flags To Create</h2>
          <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 font-medium text-gray-700">Key</th>
                    <th className="px-3 py-2 font-medium text-gray-700">
                      Type
                    </th>
                    <th className="px-3 py-2 font-medium text-gray-700">
                      Default
                    </th>
                    <th className="px-3 py-2 font-medium text-gray-700">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {REQUIRED_FLAGS.map((flag) => (
                    <tr key={flag.key}>
                      <td className="px-3 py-2">
                        <code>{flag.key}</code>
                      </td>
                      <td className="px-3 py-2">{flag.type}</td>
                      <td className="px-3 py-2">
                        <code>{flag.defaultValue}</code>
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {flag.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Main>
  )
}
