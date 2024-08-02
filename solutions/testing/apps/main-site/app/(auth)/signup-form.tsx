'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Input, Link } from '@vercel/examples-ui'
import { login, signup } from '#/actions/users'
import { SubmitButton } from './submit-button'

export const SignupForm = ({ isLogin }: { isLogin?: boolean }) => {
  const [error, setError] = useState('')
  const signupAction = async (formData: FormData) => {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const passwordRepeat = formData.get('password-repeat') as string

    if (isLogin) {
      const result = await login({ username, password })
      if (result) {
        setError(result.message)
        return
      }
    } else {
      if (password !== passwordRepeat) {
        throw new Error('Passwords do not match')
      }
      await signup({ username, password })
    }

    redirect('/')
  }

  return (
    <form className="max-w-sm mb-4" action={signupAction}>
      <label className="block mb-4">
        <span className="block text-sm text-accents-7">Username</span>
        <Input type="text" className="mt-2" name="username" required />
      </label>
      <label className="block mb-4">
        <span className="block text-sm text-accents-7">Password</span>
        <Input type="password" className="mt-2" name="password" required />
      </label>
      {!isLogin && (
        <label className="block mb-4">
          <span className="block text-sm text-accents-7">Repeat password</span>
          <Input
            type="password"
            className="mt-2"
            name="password-repeat"
            required
          />
        </label>
      )}
      {error && <p className="text-error mb-4">{error}</p>}
      <div className="flex items-center">
        <SubmitButton>{isLogin ? 'Login' : 'Signup'}</SubmitButton>
        {isLogin ? (
          <Link href="/signup" className="ml-4">
            I don&apos;t have an account
          </Link>
        ) : (
          <Link href="/login" className="ml-4">
            I already have an account
          </Link>
        )}
      </div>
    </form>
  )
}
