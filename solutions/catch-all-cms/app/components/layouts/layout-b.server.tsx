import { type FC } from 'react'
import { Layout, Text, Page } from '@vercel/examples-ui'

const LayoutA: FC<{ components: FC[] }> = ({ components }) => (
  <Layout
    title="Pagination with SSG"
    path="solutions/pagination-with-ssg"
    description="Learn how to do pagination with SSG"
  >
    <Page>
      <Text variant="h1" className="mb-6">
        Single Page CMS
      </Text>
      <Text className="mb-4">
        Everything in this page is rendered from the CMS.
      </Text>
      <div className="grid gap-4 grid-cols-3">
        {components.map((Component, i: number) => (
          <Component key={i} />
        ))}
      </div>
    </Page>
  </Layout>
)

export default LayoutA
