import { type ReactNode } from 'react'
import {
  Layout,
  Text,
  Page,
  Link,
  Code,
  Input,
  Button,
} from '@vercel/examples-ui'

const Snippet = ({ children }: { children: ReactNode }) => (
  <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
    {children}
  </pre>
)

function Home() {
  return (
    <Page className="space-y-4">
      <Text variant="h1">UI Test App</Text>
      <Text>
        This is some text to test the <Code>@vercel/examples-ui</Code> package.
      </Text>
      <Text>
        This is a link with: <Link href="/">click me</Link>. And a link with
        code:{' '}
        <Link href="/">
          <Code>click me</Code>
        </Link>
        .
      </Text>
      <Text>
        Secondary link:{' '}
        <Link href="/" secondary>
          click me
        </Link>
        .
      </Text>
      <Text>
        Text Input: <Input placeholder="Placeholder" />
      </Text>
      <Text>
        Button: <Button>Primary</Button>{' '}
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="black">Black</Button>
        <Button variant="violet">Violet</Button>
        <Button variant="white">White</Button>
      </Text>
    </Page>
  )
}

Home.Layout = Layout

export default Home
