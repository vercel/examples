import React from 'react'
import Page from '../components/page'
import Stories from '../components/stories'
import getStories from '../lib/get-stories'

export async function getStaticProps() {
  const stories = await getStories('newstories')
  return { props: { stories }, revalidate: 1 }
}
export default function Newest({ stories }) {
  return (
    <Page>
      <Stories stories={stories} />
    </Page>
  )
}
