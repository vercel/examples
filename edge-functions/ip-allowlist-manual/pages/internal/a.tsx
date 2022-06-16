import React from 'react'
import { Layout, Page, Text } from '@vercel/examples-ui'

export default function InternalAPage() {
  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          Internal B
        </Text>
      </div>
    </Page>
  )
}

InternalAPage.Layout = Layout
