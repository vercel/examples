import { Suspense } from 'react'
import AsyncComponent from './AsyncComponent'
import RevalidateMessage from '../revalidate/RevalidateMessage'
import { Page, Text } from '@vercel/examples-ui'
const Loading = () => {
  return <div className="text-fuchsia-500">Loading...</div>
}
export default async function ServerStreaming() {
  return (
    <Page className="flex flex-col gap-3">
      <Text variant="h2">Streaming Server Rendering</Text>
      <Suspense fallback={<Loading />}>
        <AsyncComponent />
      </Suspense>

      <RevalidateMessage />
    </Page>
  )
}
