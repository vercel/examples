import {
  Text,
  Page,
  Link,
  Code,
  Input,
  Button,
  List,
  Snippet,
} from '@vercel/examples-ui'

const Home = () => (
  <Page className="space-y-4">
    <Text variant="h1">UI Test App</Text>
    <Text>
      This is some text to test the <Code>@vercel/examples-ui</Code> package.
    </Text>
    <Text>
      This is a link with: <Link href="/">click me</Link>. And a link with code:{' '}
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
    <List>
      <li>This is an unordered list</li>
      <li>List item</li>
      <li>Another list item</li>
    </List>
    <Text>Code snippet:</Text>
    <Snippet>
      {`export default function Page() {
  return <h1>Hello, Next.js!</h1>
}`}
    </Snippet>
  </Page>
)

export default Home
