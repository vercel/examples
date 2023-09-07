import { Page, Text } from '@vercel/examples-ui'
import { SignupForm } from './signup-form'

export default function Signup() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">Signup or login to start:</Text>
      <SignupForm />
    </Page>
  )
}
