import { Text, Link } from '@vercel/examples-ui'
import ConfigcatLayout from '@components/layout'

export default function Marketing() {
  return (
    <>
      <Text variant="h2" className="mb-6">
        Marketing page
      </Text>
      <Text className="text-lg mb-4">This is the original marketing page</Text>
      <Text className="mb-4">
        You&apos;re currently on <b>/marketing</b>
      </Text>
      <Link href="/">Go back to /</Link>
    </>
  )
}

Marketing.Layout = ConfigcatLayout
