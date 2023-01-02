'use client'

import { Link, Page, Text } from '@vercel/examples-ui'
import {
  ChakraProvider,
  Divider,
  extendTheme,
  Select,
  theme as defaultTheme,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

interface Props {
  children: React.ReactNode
}

type Color = keyof typeof defaultTheme['colors']

export default function RootLayout({ children }: Props) {
  const [color, setColor] = useState<Color>('blue')
  const theme = useMemo(
    () => extendTheme({ colors: { brand: defaultTheme.colors[color] } }),
    [color]
  )

  return (
    <ChakraProvider theme={theme}>
      <Page className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <Text variant="h2">Brand color</Text>
          <Select onChange={(event) => setColor(event.target.value as Color)}>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
          </Select>
        </section>
        <Divider />
        {children}
        <section className="flex flex-col gap-3">
          <Link href="/">← Back to example</Link>
        </section>
      </Page>
    </ChakraProvider>
  )
}
