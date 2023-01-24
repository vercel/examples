import Page from '../../components/page'
import Item from '../../components/item'
import getItem from '../../lib/get-item'
import getComments from '../../lib/get-comments'
import { useEffect, useState } from 'react'

export function getStaticPaths() {
  return {
    // always build a sanity check
    paths: [{ params: { id: '29001721' } }],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params: { id } }) {
  const story = await getItem(id)
  return {
    props: { story, id },
    revalidate: 1,
  }
}

export default function ItemPage({ story }) {
  console.log('story', story)
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (story)
      getComments(story.comments)
        .then((comments) => {
          setComments(comments)
        })
        .catch((err) => {
          // TODO: handle error
        })
  }, [story])

  return (
    <Page>
      <Item story={story} comments={comments} />
    </Page>
  )
}
