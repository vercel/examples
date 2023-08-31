import React from 'react'
import hypertune from '../lib/hypertune'
import ClientExample from '../lib/ClientExample'
import { Text, Page, Link, List } from '@vercel/examples-ui'

export const metadata = {
  title: 'Vercel x Hypertune example',
  description:
    'An example showing how to use Hypertune and Vercel. This example builds on top of the Hypertune integration which syncs Hypertune flags into Edge Config, so you can read them from your application near-instantly.',
}

export const runtime = 'edge'

async function getFlags() {
  await hypertune.initFromVercelEdgeConfig()
  const rootNode = hypertune.root({
    context: {
      user: { id: 'test', name: 'Test', email: 'test@test.com' },
    },
  })
  const exampleFlag = rootNode.exampleFlag().get(/* fallback */ false)
  console.log('Server-side rendering feature flag:', exampleFlag)
  return { exampleFlag }
}

export default async function Home() {
  const { exampleFlag } = await getFlags()
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
        <div>
          <Text>
            Server-side feature flag: <strong>{String(exampleFlag)}</strong>
          </Text>
          <ClientExample hypertuneInitData={hypertune.getInitData()} />
        </div>
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
            Copy the <strong>NEXT_PUBLIC_HYPERTUNE_TOKEN</strong> variable from
            <strong>.env.development.local</strong> to <strong>.env</strong>
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
          <strong>exampleFlag</strong> feature flag defined on the{' '}
          <strong>root</strong> field in your project schema. If you created a
          new Hypertune project while installing the integration, it will have
          this feature flag by default. But if you connected an existing
          Hypertune project without this example flag, follow the instructions
          below:
        </Text>
        <Text>
          To add new feature flags, define them in your project schema and
          configure their logic in the{' '}
          <Link href="https://app.hypertune.com/" target="_blank">
            Hypertune console
          </Link>
          . Then add them to <strong>hypertune.graphql</strong> and run{' '}
          <strong>npx hypertune</strong> to generate type-safe methods for them
          which you can use in your app.
        </Text>
      </section>
    </Page>
  )
}
