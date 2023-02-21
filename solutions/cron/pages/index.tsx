import { Layout, Text, Code, Page, Link } from '@vercel/examples-ui'
import { getAll } from '@vercel/edge-config'
import Post from '@/components/post'

const intervals = [
  {
    id: '1m',
    name: 'Every Minute',
    cron: '* * * * *',
  },
  {
    id: '10m',
    name: 'Every 10 Minutes',
    cron: '*/10 * * * *',
  },
  {
    id: '1h',
    name: 'Every Hour',
    cron: '0 * * * *',
  },
  {
    id: '6h',
    name: 'Every 6 Hours',
    cron: '0 */6 * * *',
  },
  {
    id: '1d',
    name: 'Every Day',
    cron: '0 0 * * *',
  },
]

export default function Home({ data }: { data: any }) {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Vercel Crob Jobs Example</Text>
        <Text>
          This example shows you how you can use{' '}
          <Link
            href="https://vercel.com/docs/cron-jobs"
            target="_blank"
            rel="noreferrer noopener"
          >
            Vercel Cron Jobs
          </Link>{' '}
          to update data at different intervals.
        </Text>
        <Text>
          Each of the following sections are the{' '}
          <Link
            href="https://github.com/HackerNews/API#new-top-and-best-stories"
            target="_blank"
            rel="noreferrer noopener"
          >
            newest stories on Hacker News
          </Link>{' '}
          retrieved at a different intervals using{' '}
          <Link
            href="https://vercel.com/docs/cron-jobs"
            target="_blank"
            rel="noreferrer noopener"
          >
            Vercel Cron Jobs
          </Link>{' '}
          and stored in{' '}
          <Link
            href="https://vercel.com/docs/concepts/edge-network/edge-config"
            target="_blank"
            rel="noreferrer noopener"
          >
            Vercel Edge Config
          </Link>
          .
        </Text>
      </section>
      <section className="grid gap-6 mt-10 pt-10 border-t border-gray-300">
        <div className="flex flex-col gap-12">
          {intervals.map((interval) => (
            <div key={interval.id} className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <Text variant="h2">{interval.name}</Text>
                <Code>{interval.cron}</Code>
              </div>
              <Post {...data[interval.id]} />
            </div>
          ))}
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export async function getStaticProps() {
  let edgeConfigValues = await getAll()
  const response = await Promise.all(
    Object.keys(edgeConfigValues).map(async (key) => {
      const value = edgeConfigValues[key]
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${value}.json?print=pretty`
      ).then((res) => res.json())
      return {
        key,
        ...res,
      }
    })
  )
  const data = response.reduce((acc, cur) => {
    const { key, ...rest } = cur
    acc[cur.key] = rest
    return acc
  }, {})

  return {
    props: {
      data,
    },
    revalidate: 60,
  }
}
