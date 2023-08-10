import React from 'react'
import hypertune from '../lib/hypertune'
import ClientExample from '../lib/ClientExample'

async function getData() {
  await hypertune.waitForInitialization()
  const rootNode = hypertune.root({
    context: {
      user: { id: 'test', name: 'Test', email: 'test@test.com' },
    },
  })
  const exampleFlag = rootNode.exampleFlag({}).get(/* fallback */ false)
  console.log('Server-side feature flag:', exampleFlag)
  return { exampleFlag }
}

export default async function Home() {
  const data = await getData()
  return (
    <div>
      <h1>Hypertune with Vercel Edge Config</h1>
      <div>Server-side feature flag: {String(data.exampleFlag)}</div>
      <ClientExample />
    </div>
  )
}
