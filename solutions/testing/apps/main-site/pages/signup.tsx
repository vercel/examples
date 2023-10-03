import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import { Layout, Text, Page, Input, Button } from '@vercel/examples-ui'
import { SignupButton } from '../components/signup-button'

function Signup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.currentTarget))

    setLoading(true)

    try {
      await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      })
      await router.push('/')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">Signup to start:</Text>
      <form className="max-w-sm mb-4" onSubmit={onSubmit}>
        <label className="block mb-4">
          <span className="block text-sm text-accents-7">Username</span>
          <Input type="text" className="mt-2" name="username" required />
        </label>
        <label className="block mb-4">
          <span className="block text-sm text-accents-7">Password</span>
          <Input type="password" className="mt-2" name="password" required />
        </label>
        <SignupButton loading={loading} disabled={loading} />
      </form>
      <Text>
        There&apos;s no actual DB and the password doesn&apos;t do anything,
        your username is saved in a cookie.
      </Text>
    </Page>
  )
}

Signup.Layout = Layout

export default Signup
