'use client'

import type { ReactNode } from 'react'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import { Button } from '@vercel/examples-ui'

export const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" loading={pending} disabled={pending}>
      {children}
    </Button>
  )
}
