import type { FC } from 'react'
import cms from 'lib/cms'
import type { PropsType } from 'lib/types'
import { RenderCMSComponent } from 'components'

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string[] }
}) {
  const slug = `/pages/${params.slug.join('/')}`
  const page = await cms.getPageBySlug(slug)
  const layout = await cms.getLayoutByName('layout-a')

  if (!page) {
    return { notFound: true }
  }

  return { props: { page, layout } }
}

const SlugPage: FC<PropsType<typeof getStaticProps>> = ({ page }) => (
  <RenderCMSComponent component={page!} />
)

export default SlugPage
