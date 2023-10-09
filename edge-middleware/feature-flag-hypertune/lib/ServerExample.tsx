import { Text } from '@vercel/examples-ui'
import ClientExample from './ClientExample'
import hypertune from './hypertune'

export default async function ServerExample() {
  await hypertune.initFromServerIfNeeded()

  const rootNode = hypertune.root({
    context: {
      user: { id: 'test_id', name: 'Test', email: 'test@test.com' },
    },
  })

  const exampleFlag = rootNode.exampleFlag().get(/* fallback */ false)

  return (
    <>
      <Text>
        React Server Component (RSC) flag:{' '}
        <strong>{String(exampleFlag)}</strong>
      </Text>
      <ClientExample hypertuneInitData={hypertune.getInitData()} />
    </>
  )
}
