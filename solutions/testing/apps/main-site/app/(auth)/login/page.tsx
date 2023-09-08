import { Page, Text, Link } from '@vercel/examples-ui'
import { SignupForm } from '../signup-form'

export default function Login() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">
        Login or <Link href="/signup">signup</Link> to start:
      </Text>
      <SignupForm isLogin />
    </Page>
  )
}
