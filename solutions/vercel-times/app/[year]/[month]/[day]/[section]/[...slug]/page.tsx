import Page from 'app/article/[slug]/page'
import { getNYTimesTopStories, getStoryRouteSegments } from 'app/nytimes-api'

export async function generateStaticParams() {
  const stories = await getNYTimesTopStories()
  const routes = []

  for (const story of stories.results) {
    const { type, params } = getStoryRouteSegments(story.url)
    if (type === 'story') routes.push(params)
  }

  return routes
}

export default Page
