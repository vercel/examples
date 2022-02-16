import type { Tweet as ITweet } from "../types"

import Head from "next/head"
import { Layout, Text, Page, Code } from "@vercel/examples-ui"

import { GetStaticProps } from "next"
import api from "../api"

interface Props {
  tweets: ITweet[]
  date: string
}

const Tweet: React.VFC<{ tweet: ITweet }> = ({ tweet }) => {
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
      tweets,
      date: new Date().toTimeString(),
    },
    revalidate: 3600,
  }
}

function Tweets({ tweets, date }: Props) {
  return (
    <Page>
      <Head>
        <title>On demand ISR (Tweets) - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use On demand ISR - Tweets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Latest #nextjs tweets</Text>
        <Text>
          Updated on <Code>{date}</Code>, this page is being revalidated by a
          webhook that fires when relevant weets for #nextjs are made.
        </Text>
        <article className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </article>
      </section>
    </Page>
  )
}

Tweets.Layout = Layout

export default Tweets
