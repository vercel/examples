import { Text } from '@vercel/examples-ui'

import Counter from './counter'

export default function IndexPage() {
  return (
    <section className="flex flex-col gap-3">
      <Text variant="h2">Index page</Text>
      <Counter />
    </section>
  )
}
