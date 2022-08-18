import A from '../../components/a.server'
import cms from '../../lib/cms'
import { Text, Page } from '@vercel/examples-ui'

export function getStaticProps({ params }: { params: { slug: string[] } }) {
  return { props: cms.getPageBySlug(params.slug.join('/')) }
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
        <A />
      </div>
    </Page>
  )
}
