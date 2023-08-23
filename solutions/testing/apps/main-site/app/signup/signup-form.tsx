'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@vercel/examples-ui'
import { SignupButton } from './signup-button'

/**
 * Simple button to show the usage of Storybook
 */
export const SignupForm = () => {
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
  )
}
