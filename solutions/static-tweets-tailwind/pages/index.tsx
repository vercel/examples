import Head from 'next/head'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Tweet from '@/components/Tweet'
import { serialize } from 'next-mdx-remote/serialize'
import { replaceTweets } from '@/lib/remark-plugins'
import { Layout, Text, Code, Page } from '@vercel/examples-ui'

const components = {
  Tweet,
}

export default function Home(props: { content: MDXRemoteSerializeResult }) {
  return (
    <Page>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <section className="flex flex-col gap-6">
          <Text variant="h1">Static Tweets Tailwind</Text>
          <Text>
            This example shows you how you can generate static tweets using
            Tailwind CSS & the <Code>getStaticProps</Code> function in Next.js.
          </Text>
        </section>

        <article className="prose lg:prose-xl border-t border-gray-300 mt-16">
          <MDXRemote {...props.content} components={components} />
        </article>
      </div>
    </Page>
  )
}

Home.Layout = Layout

export async function getStaticProps() {
  const contentHtml = `
  <h2 className="text-black dark:text-white font-bold text-2xl mt-10">Regular Tweets</h2>
  <p>https://twitter.com/steventey/status/1611417461194358785</p>
  <h2 className="text-black dark:text-white font-bold text-2xl mt-10">Image Tweets</h2>
  <p>https://twitter.com/steventey/status/1602318152288829440</p>
  <h2 className="text-black dark:text-white font-bold text-2xl mt-10">Video Tweets</h2>
  <p>https://twitter.com/steventey/status/1613928948915920896</p>
  <h2 className="text-black dark:text-white font-bold text-2xl mt-10">Multiple Images</h2>
  <p>https://twitter.com/jstngraphics/status/1477021464620515328</p>
  <h2 className="text-black dark:text-white font-bold text-2xl mt-10">Link Preview</h2>
  <p>https://twitter.com/steventey/status/1572958186667233282</p>
  <h2 className="text-black dark:text-white font-bold text-2xl mt-10">Poll Tweet</h2>
  <p>https://twitter.com/DAOCentral/status/1475184169588125699</p>
  `

  // serialize the content string into MDX
  const mdxSource = await getMdxSource(contentHtml)

  return {
    props: {
      content: mdxSource,
    },
  }
}

async function getMdxSource(postContents: string) {
  // Serialize the content string into MDX
  const mdxSource = await serialize(postContents, {
    mdxOptions: {
      remarkPlugins: [replaceTweets],
    },
  })

  return mdxSource
}
