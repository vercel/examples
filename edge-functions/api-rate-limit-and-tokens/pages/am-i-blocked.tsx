import React from 'react'
import { Layout, Text } from '@vercel/examples-ui'

const Index = () => (
  <div className="w-full max-w-3xl mx-auto pt-16 mb-4">
    <div className="text-center mb-6">
      <Text variant="h1" className="mb-4">
        IP Blocking with Upstash
      </Text>
      <Text>
        You are not blocked. Otherwise you won&apos;t be able to see this page
        but the <b>/blocked</b> page instead.
      </Text>
    </div>
  </div>
)

Index.Layout = Layout

export default Index
