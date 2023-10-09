import React from 'react'
import { Text, Page, Link, List } from '@vercel/examples-ui'
import ServerExample from '../lib/ServerExample'

export const metadata = {
  title: 'Vercel x Hypertune example',
  description:
    'An example showing how to use Hypertune and Vercel. This example builds on top of the Hypertune integration which syncs Hypertune flags into Edge Config, so you can read them from your application near-instantly.',
}

export const runtime = 'edge'

export default async function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Hypertune with Vercel Edge Config</Text>
        <Text>
          This example shows how to use the{' '}
          <Link
            href="https://vercel.com/integrations/hypertune"
            target="_blank"
          >
            Hypertune integration
          </Link>{' '}
          with Edge Config.
        </Text>
      </section>
      <section className="flex flex-col gap-4">
        <ServerExample />
        <Text>
          Once you&apos;ve deployed this project, open the{' '}
          <Link href="https://app.hypertune.com/" target="_blank">
            Hypertune console
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
            Run <strong>npm i</strong>
          </li>
          <li>
            Run <strong>npm run dev</strong>
          </li>
        </List>
        <Text>
          This example assumes your Hypertune project has an{' '}
          <strong>exampleFlag</strong> feature flag.
        </Text>
        <Text>
          To add a new feature flag, create it in the{' '}
          <Link href="https://app.hypertune.com/" target="_blank">
            Hypertune console
          </Link>
          , then regenerate the client with <strong>npx hypertune</strong> so
          you can access it with end-to-end type-safety.
        </Text>
      </section>
    </Page>
  )
}
