import { type FC, use } from 'react'
import cms from 'lib/cms'
import { RenderCMSComponent } from '../components'

async function getPageBySlug(slug: string[]) {
  const page = await cms.getPageBySlug(`/${slug.join('/')}`)

  if (!page) {
    throw new Error('Page not found')
  }

  return page
}

const SlugPage: FC<{ params: { slug: string[] } }> = ({ params: { slug } }) => {
  const page = use(getPageBySlug(slug))
  return <RenderCMSComponent component={page!} />
}

export default SlugPage
