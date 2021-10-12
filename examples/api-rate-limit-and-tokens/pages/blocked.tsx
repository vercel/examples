import React from 'react'
import { Layout, Link, Text } from '@edge-functions/ui'

const Index = () => (
  <div className="w-full max-w-3xl mx-auto pt-16 mb-4">
    <div className="text-center mb-6">
      <Text variant="h1" className="mb-4">
        IP Blocking with Upstash
      </Text>
      <Text>
        You're seeing this page because your IP has been blocked, go to the{' '}
        <Link href="/">homepage</Link> to unblock your IP.
      </Text>
    </div>
  </div>
)

Index.Layout = Layout

export default Index
