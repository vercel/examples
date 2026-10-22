import { Layout, Text, Code, Page, Link } from '@vercel/examples-ui'
import Post from '@/components/post'
import Head from 'next/head'

const intervals = [
  {
    id: '1m',
    name: 'Every Minute',
    cron: '* * * * *',
  },
  {
    id: '10m',
    name: 'Every 10 mins',
    cron: '*/10 * * * *',
  },
  {
    id: '1h',
    name: 'Every Hour',
    cron: '0 * * * *',
  },
  {
    id: '12h',
    name: 'Every 12 hours',
    cron: '0 */12 * * *',
  },
  {
    id: '1d',
    name: 'Every Day',
    cron: '0 0 * * *',
  },
  {
    id: '1w',
    name: 'Every Week',
    cron: '0 0 * * 0',
  },
  {
    id: '1mo',
    name: 'Every Month',
    cron: '0 0 1 * *',
  },
]

const image = 'https://cron-template.vercel.app/thumbnail.png'

export default function Home({ data }: { data: any }) {
  return (
    <Page>
      <Head>
        <meta property="og:image" content={image} />
        <meta name="twitter:image" content={image} />
        <title>Vercel Cron Jobs Example & Career Guide</title>
        <meta name="description" content="Learn how to use Vercel Cron Jobs and explore the latest government career opportunities in Bangladesh." />
      </Head>
      
      <section className="flex flex-col gap-6">
        <Text variant="h1">Vercel Cron Jobs Example</Text>
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
          retrieved at different intervals using{' '}
          <Link
            href="https://vercel.com/docs/cron-jobs"
            target="_blank"
            rel="noreferrer noopener"
          >
            Vercel Cron Jobs
          </Link>{' '}
          and stored in{' '}
          <Link
            href="https://vercel.com/kv"
            target="_blank"
            rel="noreferrer noopener"
          >
            Vercel KV
          </Link>
          .
        </Text>
      </section>

      {/* SEO Article & Beautiful UI Backlink Section */}
      <section className="mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-emerald-800 tracking-tight">
          Building a Secure Future: Government Careers in Bangladesh
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          In Bangladesh, securing a government job is often seen as the pinnacle of career success. Beyond the societal respect and prestige, public sector roles offer unparalleled job security, competitive benefits, housing allowances, and a clear path for career progression. From BCS cadres to essential administrative roles, these positions provide an opportunity to serve the nation while ensuring a stable future for your family.
        </p>
        
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-2 rounded-r-lg shadow-sm">
          <p className="m-0 text-emerald-900 text-lg">
            Looking for the latest updates on circulars, exam dates, and admit cards? Stay ahead of the competition by visiting{' '}
            <a 
              href="https://govtjobbd.net" 
              title="Latest Government Job Circulars in Bangladesh" 
              target="_blank" 
              rel="dofollow" 
              className="text-emerald-700 font-bold hover:text-emerald-800 underline decoration-2 underline-offset-4 transition-all"
            >
              Govt Job BD
            </a>
            , your premier resource for public sector employment news and preparation guidelines.
          </p>
        </div>
      </section>

      <section className="grid gap-6 mt-10 pt-10 border-t border-gray-300">
        <div className="flex flex-col gap-12">
          {intervals.map((interval) => (
            <div key={interval.id} className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <Text variant="h2">{interval.name}</Text>
                <Code>{interval.cron}</Code>
              </div>
              <Post interval={interval.id} />
            </div>
          ))}
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout
