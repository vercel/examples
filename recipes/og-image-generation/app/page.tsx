import {
  Page,
  Text,
  Code,
  Link,
  Layout,
  getMetadata,
} from '@vercel/examples-ui'

export const metadata = getMetadata({
  title: 'og-image-generation',
  description: 'og-image-generation',
})

export default function Home() {
  return (
    <Layout path="recipes/og-image-generation">
      <Page className="flex flex-col gap-12">
        <Text variant="description"></Text>
        <section className="flex flex-col gap-6">
          <Text variant="h1">OG Image Generation Examples</Text>
          <Text>
            For each page below, we define the openGraph property of the{' '}
            <Link
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph"
              target="_blank"
            >
              metadata Object
            </Link>{' '}
            that comes with the Next.js metadata API. We set the OG image URL to
            point to a different implementation of the{' '}
            <Link href="https://vercel.com/docs/functions/og-image-generation/og-image-api">
              @vercel/og package
            </Link>
            . You can open each link in an{' '}
            <Link href="https://www.opengraph.xyz/">open graph simulator</Link>{' '}
            to see the result.
          </Text>
        </section>

        <section className="flex flex-col gap-3">
          <Link href="/param">
            <Text variant="h2">Dynamic text generated as image</Text>
          </Link>
          <Text>
            In this example, your post image is made up of a static SVG logo and
            the post title. You will pass the post title as a parameter and use
            TypeScript.
          </Text>
        </section>

        <section className="flex flex-col gap-3">
          <Link href="/dynamic-image">
            <Text variant="h2">Using an external dynamic image</Text>
          </Link>
          <Text>
            In this example, your post image is made up of an avatar user image
            and the URL of the user&aposs profile. The image is fetched remotely
            based on the username passed as a parameter.
          </Text>
        </section>

        <section className="flex flex-col gap-3">
          <Link href="/emoji">
            <Text variant="h2">Using emoji in your image</Text>
          </Link>
          <Text>In this example, your post image is made up of emojis.</Text>
        </section>

        <section className="flex flex-col gap-3">
          <Link href="/local-image">
            <Text variant="h2">Using a local image</Text>
          </Link>
          <Text>In this example, you use an image stored locally.</Text>
        </section>
      </Page>
    </Layout>
  )
}
