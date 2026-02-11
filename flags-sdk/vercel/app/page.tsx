import { Text, Page, Link, List, Code } from '@vercel/examples-ui'
import { showNewFeature, headerVariant } from '@/lib/flags'

export default async function Home() {
  const showFeature = await showNewFeature()
  const variant = await headerVariant()

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Flags SDK with Vercel</Text>
        <Text>
          This example demonstrates how to use the{' '}
          <Link href="https://flags-sdk.dev" target="_blank">
            Flags SDK
          </Link>{' '}
          with the Vercel adapter to implement feature flags in a Next.js
          application.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Current Flag Values</Text>

        <div className="rounded-lg border border-accents-2 p-4">
          <div className="flex items-center justify-between py-2 border-b border-accents-2">
            <Code>show-new-feature</Code>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                showFeature
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {showFeature ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <Code>header-variant</Code>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {variant}
            </span>
          </div>
        </div>

        {showFeature && (
          <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <Text className="text-white font-semibold">
              New Feature Banner is Enabled!
            </Text>
            <Text className="text-white/80 text-sm">
              This banner only appears when the show-new-feature flag is
              enabled.
            </Text>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">How it works</Text>
        <List>
          <li>
            Flags are defined in <Code>lib/flags.ts</Code> using the{' '}
            <Code>flag</Code> function from the Flags SDK
          </li>
          <li>
            The <Code>@flags-sdk/vercel</Code> adapter connects to Vercel Flags
          </li>
          <li>
            Flags are evaluated server-side in Server Components for optimal
            performance
          </li>
          <li>
            The Vercel Toolbar lets you override flag values during development
          </li>
        </List>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Getting Started</Text>
        <List>
          <li>
            Clone this repository and <Code>cd</Code> into the project directory
          </li>
          <li>
            Run <Code>vercel link</Code> to link to your Vercel project
          </li>
          <li>
            Run <Code>vercel env pull .env.development.local</Code> to pull
            environment variables
          </li>
          <li>
            Run <Code>pnpm i</Code> to install dependencies
          </li>
          <li>
            Run <Code>pnpm dev</Code> to start the development server
          </li>
        </List>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Learn More</Text>
        <List>
          <li>
            <Link href="https://flags-sdk.dev" target="_blank">
              Flags SDK Documentation
            </Link>
          </li>
          <li>
            <Link href="https://vercel.com/docs/flags" target="_blank">
              Vercel Flags Documentation
            </Link>
          </li>
          <li>
            <Link
              href="https://vercel.com/docs/flags/flags-explorer"
              target="_blank"
            >
              Flags Explorer Documentation
            </Link>
          </li>
        </List>
      </section>
    </Page>
  )
}
