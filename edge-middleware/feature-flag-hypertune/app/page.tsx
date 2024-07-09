import React from 'react'
import { Text, Page, Link, List } from '@vercel/examples-ui'
import ClientComponent from '../components/ClientComponent'
import ServerComponent from '../components/ServerComponent'

export const metadata = {
  title: 'Vercel x Hypertune example',
  description:
    'An example showing how to use Hypertune with Vercel. This example builds on top of the Hypertune integration which syncs Hypertune flags into Edge Config so you can read them from your application near-instantly. It also shows how to integrate with the Vercel Toolbar so you can easily view and override your feature flags without leaving your frontend. Finally, it shows how to use the Vercel Feature Flags pattern to use flags on a static page.',
}

export const runtime = 'edge'

export default async function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Hypertune with Vercel</Text>
        <Text>
          This example shows how to use the{' '}
          <Link
            href="https://vercel.com/integrations/hypertune"
            target="_blank"
          >
            Hypertune integration
          </Link>{' '}
          with Vercel Edge Config to initialize the Hypertune SDK with near-zero
          latency on the server so you can access your feature flags and run A/B
          tests with no performance impact to your app.
        </Text>
        <Text>
          It also shows how to integrate Hypertune with Vercel&apos;s Flags SDK
          to use the Vercel Toolbar, to view and override your feature flags
          without leaving your frontend, and Vercel&apos;s Flags pattern.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <ServerComponent />
        <ClientComponent />
        <Text>
          Once you&apos;ve deployed this project, open the{' '}
          <Link href="https://app.hypertune.com/" target="_blank">
            Hypertune UI
          </Link>{' '}
          and try updating your feature flag logic.
        </Text>
        <Text>To develop your project locally:</Text>
        <List>
          <li>
            Clone your project&apos;s repository and <strong>cd</strong> into it
          </li>
          <li>
            Run <strong>vercel link</strong> to link to the Vercel project
          </li>
          <li>
            Run <strong>vercel env pull .env.development.local</strong> to pull
            your environment variables
          </li>
          <li>
            Run <strong>pnpm i</strong>
          </li>
          <li>
            Run <strong>pnpm run dev</strong>
          </li>
        </List>
        <Text>
          To add a new feature flag, create it in the{' '}
          <Link href="https://app.hypertune.com/" target="_blank">
            Hypertune UI
          </Link>
          , then regenerate the client with <strong>pnpm hypertune</strong> so
          you can access it with full end-to-end type-safety.
        </Text>
      </section>
    </Page>
  )
}
