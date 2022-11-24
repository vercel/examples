import { Text } from '@vercel/examples-ui'
import { use } from 'react'
import Nav from './nav'

type Props = {
  lang: 'es' | 'en' | 'de'
}

export default function Welcome({ lang }: Props) {
  const { home } = use(import(`../../../dictionaries/${lang}.json`))

  return (
    <div className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">
      <Nav />
      <Text variant="h2">
        {home.title_text} <a href="https://nextjs.org">{home.title_link}</a>
      </Text>
    </div>
  )
}
