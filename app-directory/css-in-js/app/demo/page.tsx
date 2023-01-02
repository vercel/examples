import { Text } from '@vercel/examples-ui'
import { Buttons, Tabs, Skeletons } from './showcase'

export default function IndexPage() {
  return (
    <section className="flex flex-col gap-6">
      <article className="flex flex-col gap-3">
        <Text variant="h2">Buttons</Text>
        <Buttons />
      </article>
      <article className="flex flex-col gap-3">
        <Text variant="h2">Tabs</Text>
        <Tabs />
      </article>
      <article className="flex flex-col gap-3">
        <Text variant="h2">Skeleton</Text>
        <Skeletons />
      </article>
    </section>
  )
}
