import { type FC, experimental_use as use } from 'react'
import cms from 'lib/cms'
// import { RenderCMSComponent } from '../components/index.server'

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
    return { notFound: true }
  }

  return page
}

const SlugPage: FC<{ params: { slug: string[] } }> = ({ params: { slug } }) => {
  const page = use(getPageBySlug(slug))

  console.log('PAGE', page)

  return (
    <h1>Hello world</h1>
    // <RenderCMSComponent component={page!} />
  )
}

export default SlugPage
