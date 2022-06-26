import type { FC } from 'react'
import type { Tweet as ITweet } from '../types'

import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'

import { GetStaticProps } from 'next'
import api from '../api'

interface Props {
  tweets: ITweet[]
  date: string
}

const Tweet: FC<{ tweet: ITweet }> = ({ tweet }) => {
  return (
    <div className={`flex flex-col shadow-lg overflow-hidden relative p-4`}>
      <Text className="mt-2 text-base leading-6 text-gray-500">
        {decodeURIComponent(tweet.text)}
      </Text>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const tweets = await api.tweets()

  return {
    props: {
      tweets: tweets.map((tweet) => ({
        ...tweet,
        text: encodeURIComponent(tweet.text),
      })),
      date: new Date().toTimeString(),
    },
  }
}

function Tweets({ tweets, date }: Props) {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Latest #nextjs tweets</Text>
        <Text>
          Updated on <Code>{date}</Code>, this page is being revalidated by a
          webhook that fires when relevant tweets for #nextjs are made. The
          webhook contains a secret key that validates the request to avoid DDOS
          attacks:
        </Text>
        <Snippet>
          {`export default async function handler(req, res) {
  // Check the secret
  if (process.env.SECRET === req.headers["x-secret-key"]) {
    // Revalidate /tweets route
    await res.revalidate("/tweets")

    // Return a response for debugging
    return res.json({ revalidated: true })
  }

  // If secret is not correct, return 401
  return res.status(401).end()
}
`}
        </Snippet>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <article className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </article>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Link href="/">Back to home</Link>
      </section>
    </Page>
  )
}

Tweets.Layout = Layout

export default Tweets
