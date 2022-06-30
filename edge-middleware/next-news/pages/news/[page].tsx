import Page from '../../components/page'
import Stories from '../../components/stories'
import getStories from '../../lib/get-stories'

export function getStaticPaths() {
  return {
    paths: [{ params: { page: '1' } }, { params: { page: '2' } }],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params: { page = 1 } }) {
  page = Number(page)
  const stories = await getStories('topstories', { page })
  return {
    props: { page, stories },
    revalidate: 1,
  }
}

export default function News({ page, url, stories }) {
  const offset = (page - 1) * 30
  return (
    <Page>
      <Stories page={page} offset={offset} stories={stories} />
    </Page>
  )
}
