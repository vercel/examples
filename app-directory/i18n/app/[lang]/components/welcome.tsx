import { Text } from '@vercel/examples-ui'
import Nav from './nav'

type Props = {
  translations: Record<string, string>
}

export default function Welcome({ translations }: Props) {
  return (
    <div className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">
      <Nav />
      <Text variant="h2">
        {translations.title_text}{' '}
        <a href="https://nextjs.org">{translations.title_link}</a>
      </Text>
    </div>
  )
}
