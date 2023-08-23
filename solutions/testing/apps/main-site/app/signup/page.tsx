import { Page, Text } from '@vercel/examples-ui'
import { SignupForm } from './signup-form'

export default function Signup() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">Signup to start:</Text>
      <SignupForm />
      <Text>
        There&apos;s no actual DB and the password doesn&apos;t do anything,
        your username is saved in a cookie.
      </Text>
    </Page>
  )
}
