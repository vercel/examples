import { Page, Text, Code, Link } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">-- PLOP TITLE HERE -- usage example</Text>
        <Text>
          This example shows how to Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptas eligendi aliquam officiis aliquid neque
          consequuntur ipsam iste, id, minima sit nulla quidem numquam, vitae
          hic quae sapiente nostrum vel ut.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Header</Text>
        <Text>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error quasi{' '}
          <code>dolorum natus</code>, quaerat voluptatum laboriosam minima quis
          consectetur quam architecto veniam! Ex atque rem, unde tempora eaque
          quasi mollitia tenetur.
        </Text>
      </section>
    </Page>
  )
}
