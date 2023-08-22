import React from 'react'
import hypertune from '../lib/hypertune'
import ClientExample from '../lib/ClientExample'

export const runtime = 'edge'

async function getFlags() {
  await hypertune.waitForInitialization()
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1.75,
      }}
    >
      <div style={{ maxWidth: 700, marginTop: 25 }}>
        <h1>Hypertune with Vercel Edge Config</h1>
        <div>
          Server-side feature flag: <strong>{String(exampleFlag)}</strong>
        </div>
        <ClientExample />
        <p>
          Once you&apos;ve deployed this project, open the{' '}
          <a href="https://app.hypertune.com/" target="_blank">
            Hypertune console
          </a>{' '}
          and try updating your feature flag logic.
        </p>
        <p>To develop your project locally:</p>
        <ol>
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
        </ol>
        <p>
          This example assumes your Hypertune project has an{' '}
          <strong>exampleFlag</strong> feature flag defined on the{' '}
          <strong>root</strong> field in your project schema. If you created a
          new Hypertune project while installing the integration, it will have
          this feature flag by default. But if you connected an existing
          Hypertune project without this example flag, follow the instructions
          below:
        </p>
        <p>
          To add new feature flags, define them in your project schema and
          configure their logic in the{' '}
          <a href="https://app.hypertune.com/" target="_blank">
            Hypertune console
          </a>
          . Then add them to <strong>hypertune.graphql</strong> and run{' '}
          <strong>npx hypertune</strong> to generate type-safe methods for them
          which you can use in your app.
        </p>
      </div>
    </div>
  )
}
