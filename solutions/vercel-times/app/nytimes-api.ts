import dataCopy from './data.json'

export interface Story {
  section: string
  subsection: string
  title: string
  abstract: string
  url: string
  uri: string
  byline: string
  item_type: string
  updated_date: string
  created_date: string
  published_date: string
  material_type_facet: string
  kicker: string
  des_facet: string[]
  org_facet: string[]
  per_facet: string[]
  geo_facet: string[]
  multimedia?: {
    url: string
    format: string
    height: number
    width: number
    type: string
    subtype: string
    caption: string
    copyright: string
  }[]
  short_url: string
}

interface TopStories {
  status: string
  copyright: string
  section: string
  last_updated: string
  num_results: number
  results: Story[]
}

export async function getNYTimesTopStories(): Promise<TopStories> {
  // Return a local copy of the result to avoid 429 errors from the nytimes.com API
  return dataCopy

  // For reference and to know what sections are available:
  // https://developer.nytimes.com/docs/top-stories-product/1/routes/%7Bsection%7D.json/get
  const section = 'home'
  const url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${process.env.NYTIMES_API_KEY}`
  const res = await fetch(url, { next: { revalidate: 60 * 60 } })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch NYTimes top stories. ${res.status} - ${res.statusText}`
    )
  }

  const data = await res.json()

  // console.log(JSON.stringify(data, null, 2));

  return data
}

type StoryRouteSegments =
  | {
      type: 'article'
      params: { section: string; slug: string }
    }
  | {
      type: 'story'
      params: {
        year: string
        month: string
        day: string
        section: string
        slug: string[]
      }
    }

export function getStoryRouteSegments(url: string): StoryRouteSegments {
  const urlObj = new URL(url)
  let [, year, month, day, section, ...slug] = urlObj.pathname.split('/')

  if (!day) {
    return {
      type: 'article',
      params: { section: year, slug: month },
    }
  }

  return {
    type: 'story',
    params: { year, month, day, section, slug },
  }
}
