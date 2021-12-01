import { useState, useEffect } from 'react'
import { Layout, Page, Text, List, Code } from '@vercel/edge-functions-ui'
import { Button } from '@company/ui'
import { matchingTextColor, randomColor } from '@company/utils'

export default function Index() {
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
      <Text variant="h1" className="mb-6">
        Shared Dependencies
      </Text>
      <Text className="mb-4">
        In this demo we have two dependencies that are installed in this app and
        available in the same repository.
      </Text>
      <List className="mb-4">
        <li>
          <Code>packages/ui</Code> exports the button you see below
        </li>
        <li>
          <Code>packages/utils</Code> exports functions to generate random
          colors.
        </li>
      </List>
      {bgColor && textColor && (
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
      )}
    </Page>
  )
}

Index.Layout = Layout
