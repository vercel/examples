import cms from '../../lib/cms'
import { Text, Page } from '@vercel/examples-ui'
import Components from '../components'

export async function getStaticProps({
  params,
}: {
  params: { slug: string[] }
}) {
  const slug = `/${params.slug.join('/')}`
  return { props: await cms.getPageBySlug(slug) }
}

export default function SlugPage({ components }: any) {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Single Page CMS
      </Text>
      <Text className="mb-4">
        Below are the components used by this page {JSON.stringify(components)}
      </Text>
      <div className="grid gap-4 grid-cols-3">
        {components.map(({ name }: any, i: number) => {
          const Component = Components[name]
          return <Component key={i} />
        })}
      </div>
    </Page>
  )
}
