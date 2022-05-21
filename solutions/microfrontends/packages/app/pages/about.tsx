import { useState, useEffect } from 'react'
import { Layout, Page, Text, List, Code, Link } from '@vercel/examples-ui'
import { Button, Quote } from '@company/design-system'
import { matchingTextColor, randomColor } from '@company/utils'
import fs from 'fs'

// console.log('PP', fs)

export async function getStaticProps() {
  console.log('Hello!', fs)
  return { props: {} }
}

export default function Home() {
  const [bgColor, setBgColor] = useState('')
  const [textColor, setTextColor] = useState('')
  const changeColor = () => {
    const bg = randomColor()
    setBgColor(bg)
    setTextColor(matchingTextColor(bg))
  }

  useEffect(changeColor, [])

  return (
    <Page>
      <ul className="inline-flex mb-4">
        <li>
          <Link href="/external">External Page</Link>
        </li>
        <li className="ml-4">
          <Link href="/about">About (External)</Link>
        </li>
        <li className="ml-4">
          <Link href="/docs">Docs (Multi Zones)</Link>
        </li>
      </ul>
      <Text variant="h1" className="mb-6">
        Microfrontends
      </Text>
      <Text className="mb-4">
        In this monorepo app we have a single site with two installed
        dependencies that are available in the same repository.
      </Text>
      <List className="mb-4">
        <li>
          <Code>packages/app</Code> is the current Next.js site you&apos;re
          looking at
        </li>
        <li>
          <Code>packages/design-system</Code> is a package that exports the
          components you see below
        </li>
        <li>
          <Code>packages/utils</Code> is a package that exports a function that
          generates random colors. Click the button to see it in action
        </li>
      </List>
      {bgColor && textColor && (
        <>
          <Button
            style={{
              backgroundColor: bgColor,
              color: textColor,
              borderColor: textColor,
            }}
            onClick={changeColor}
          >
            Change Color
          </Button>
        </>
      )}
      <Quote className="mt-4">
        This is the <Code>Quote</Code> component in the design system.
      </Quote>
    </Page>
  )
}

Home.Layout = Layout
