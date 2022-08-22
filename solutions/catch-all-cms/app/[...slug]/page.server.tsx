import type { FC } from 'react'
import cms from 'lib/cms'
import type { PropsType } from 'lib/types'
import { RenderCMSComponent } from '../components/index.server'

export async function getStaticProps({
  params,
}: {
  params: { slug: string[] }
}) {
  const slug = `/${params.slug.join('/')}`
  const page = await cms.getPageBySlug(slug)

  return { props: { page } }
}

const SlugPage: FC<PropsType<typeof getStaticProps>> = ({ page }) => (
  <RenderCMSComponent component={page!} />
)

export default SlugPage
