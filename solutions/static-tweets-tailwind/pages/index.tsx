import Head from 'next/head'
import Image from 'next/image'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Tweet from '@/components/Tweet'
import { getTweets } from '@/lib/twitter'
import { serialize } from 'next-mdx-remote/serialize'
import { replaceTweets } from '@/lib/remark-plugins'

const components = {
  Tweet,
}

export default function Home(props: { content: MDXRemoteSerializeResult }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Static Tweets (Tailwind)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* added link to github repo */}
      <a
        href="https://github.com/vercel/examples/tree/main/solutions/static-tweets-tailwind"
        target="_blank"
        rel="noreferrer"
        className="fixed top-5 right-5"
      >
        <Image
          src="/github.svg"
          alt="Github"
          width={25}
          height={25}
          className="bg-white rounded-full"
        />
      </a>

      <main className="flex flex-col items-center justify-center w-full flex-1">
        <article className="prose lg:prose-xl w-11/12 max-w-3xl mx-auto mt-20 mb-48">
          <MDXRemote {...props.content} components={components} />
        </article>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noreferrer"
        >
          Powered by{' '}
          <div className="flex ml-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={71} height={16} />
          </div>
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const contentHtml = `
  <h2 className="text-black dark:text-white">Regular Tweets</h2>
  <p>https://twitter.com/steventey/status/1611417461194358785</p>
  <h2 className="text-black dark:text-white">Image Tweets</h2>
  <p>https://twitter.com/steventey/status/1602318152288829440</p>
  <h2 className="text-black dark:text-white">Video Tweets</h2>
  <p>https://twitter.com/steventey/status/1613928948915920896</p>
  <h2 className="text-black dark:text-white">Multiple Images</h2>
  <p>https://twitter.com/jstngraphics/status/1477021464620515328</p>
  <h2 className="text-black dark:text-white">Link Preview</h2>
  <p>https://twitter.com/steventey/status/1572958186667233282</p>
  <h2 className="text-black dark:text-white">Poll Tweet</h2>
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
