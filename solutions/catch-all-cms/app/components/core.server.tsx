import { FC, ReactNode } from 'react'
import { Page, Text } from '@vercel/examples-ui'

export const H1: FC<{ children: ReactNode }> = ({ children }) => (
  <Text variant="h1" className="mb-6">
    {children}
  </Text>
)

export const Paragraph: FC<{ children: ReactNode }> = ({ children }) => (
  <Text className="mb-4">{children}</Text>
)

export const Container = Page
