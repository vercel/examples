'use client'

import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import { Button } from '@vercel/examples-ui'

export const SignupButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" loading={pending} disabled={pending}>
      Signup
    </Button>
  )
}
