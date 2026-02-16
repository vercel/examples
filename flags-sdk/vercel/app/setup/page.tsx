import Link from 'next/link'
import { Main } from '@/components/main'

// Demo-only setup page:
// this route exists to guide users through configuring the example quickly.
const REQUIRED_FLAGS = [
  {
    key: 'summer-sale',
    link: 'https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fflags%3Fcreate%3D%257B%2522key%2522%253A%2522summer-sale%2522%257D&title=Create+Feature+Flag',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show/hide the summer sale banner.',
  },
  {
    key: 'free-delivery',
    link: 'https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fflags%3Fcreate%3D%257B%2522key%2522%253A%2522free-delivery%2522%257D&title=Create+Feature+Flag',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show/hide the free delivery banner.',
  },
  {
    key: 'proceed-to-checkout-color',
    link: 'https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fflags%3Fcreate%3D%257B%2522key%2522%253A%2522proceed-to-checkout-color%2522%252C%2522options%2522%253A%255B%257B%2522label%2522%253A%2522Blue%2522%252C%2522value%2522%253A%2522blue%2522%257D%252C%257B%2522label%2522%253A%2522Green%2522%252C%2522value%2522%253A%2522green%2522%257D%252C%257B%2522label%2522%253A%2522Red%2522%252C%2522value%2522%253A%2522red%2522%257D%255D%257D&title=Create+Feature+Flag',
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
            You’re almost ready. Complete your setup by creating the following
            feature flags and pulling environment variables
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
            <div className="space-y-4">
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
                    Open your Vercel project, go to the Flags tab, and create
                    the exact flag keys listed below.
                  </p>

                  <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto rounded-xl">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 font-medium text-gray-700">
                              Key
                            </th>
                            <th className="px-3 py-2 font-medium text-gray-700">
                              Type
                            </th>
                            <th className="px-3 py-2 font-medium text-gray-700">
                              Default
                            </th>
                            <th className="px-3 py-2 font-medium text-gray-700">
                              Description
                            </th>
                            <th>&nbsp;</th>
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
                              <td className="px-3 py-2">
                                <Link
                                  href={flag.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-link flex items-center gap-1"
                                >
                                  Create
                                  <svg
                                    data-testid="geist-icon"
                                    stroke-linejoin="round"
                                    viewBox="0 0 16 16"
                                    className="current-color size-4"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M13.5 10.25V13.25C13.5 13.3881 13.3881 13.5 13.25 13.5H2.75C2.61193 13.5 2.5 13.3881 2.5 13.25L2.5 2.75C2.5 2.61193 2.61193 2.5 2.75 2.5H5.75H6.5V1H5.75H2.75C1.7835 1 1 1.7835 1 2.75V13.25C1 14.2165 1.7835 15 2.75 15H13.25C14.2165 15 15 14.2165 15 13.25V10.25V9.5H13.5V10.25ZM9 1H9.75H14.2495C14.6637 1 14.9995 1.33579 14.9995 1.75V6.25V7H13.4995V6.25V3.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L12.4388 2.5H9.75H9V1Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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
            <p>
              See{' '}
              <Link
                href="https://vercel.com/docs/flags/vercel-flags/quickstart?utm_source=vercel-examples"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Quickstart guide
              </Link>
              {' '}for more information.
            </p>
          </div>
        </section>
      </div>
    </Main>
  )
}
