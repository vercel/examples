import React from 'react'
import { Layout, Page, Text } from '@vercel/examples-ui'

export default function InternalBPage() {
  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          Internal Page
        </Text>
      </div>
    </Page>
  )
}

InternalBPage.Layout = Layout
