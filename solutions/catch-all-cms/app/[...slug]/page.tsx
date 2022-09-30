import { type FC, experimental_use as use } from 'react'
import cms from 'lib/cms'
import { RenderCMSComponent } from '../components'

// export async function getStaticProps({
//   params,
// }: {
//   params: { slug: string[] }
// }) {
//   const slug = `/${params.slug.join('/')}`
//   const page = await cms.getPageBySlug(slug)

//   if (!page) {
//     return { notFound: true }
//   }

//   return { props: { page } }
// }

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
