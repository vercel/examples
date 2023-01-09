import { Text } from '@vercel/examples-ui'

import Counter from '../counter'

export default function NestedPage() {
  return (
    <section className="flex flex-col gap-3">
      <Text variant="h2">Nested page</Text>
      <Counter />
    </section>
  )
}
