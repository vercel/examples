import { redirect } from 'next/navigation'
import { Input } from '@vercel/examples-ui'
import { signup } from '#/actions/users'
import { SignupButton } from './signup-button'

export const SignupForm = () => {
  const signupAction = async (formData: FormData) => {
    'use server'

    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const passwordRepeat = formData.get('password-repeat') as string

    if (passwordRepeat) {
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
      <label className="block mb-4">
        <span className="block text-sm text-accents-7">Repeat password</span>
        <Input
          type="password"
          className="mt-2"
          name="password-repeat"
          required
        />
      </label>
      <SignupButton />
    </form>
  )
}
