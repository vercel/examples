import { Text } from '@vercel/examples-ui'
import OptimizeLayout from '@components/layout'

export default function About() {
  return (
    <>
      <Text variant="h2" className="mb-6">
        About page
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>/about</b>
      </Text>
      <Text>This is the original about page</Text>
    </>
  )
}

About.Layout = OptimizeLayout
