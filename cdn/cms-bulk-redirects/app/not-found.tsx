import Link from 'next/link'
import { Page, Text, Button } from '@vercel/examples-ui'

export default function NotFound() {
  return (
    <Page className="flex flex-col items-center justify-center gap-4 text-center">
      <Text variant="h1" className="text-white">
        Collection not found
      </Text>
      <Text className="text-white/70">This collection doesn&apos;t exist. Try another path or return home.</Text>
      <Button href="/">Back to overview</Button>
    </Page>
  )
}
