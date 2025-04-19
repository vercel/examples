import { Page, Text, Link } from '@vercel/examples-ui'
import { SignupForm } from '../signup-form'

export default function Signup() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">
        Signup or <Link href="/login">login</Link> to start:
      </Text>
      <SignupForm />
    </Page>
  )
}
