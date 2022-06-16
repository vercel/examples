import React from 'react'
import { Layout, Page, Text, Input, Button } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          IP Allowlist
        </Text>
      </div>
    </Page>
  )
}

Index.Layout = Layout
