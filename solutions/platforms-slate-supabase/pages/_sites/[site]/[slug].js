import React from 'react'
import supabase from '@/lib/supabase'
import Layout from '@/components/sites/Layout'
import BlurImage from '@/components/BlurImage'
import Date from '@/components/Date'
import { Text } from 'slate'
import Highlight from 'react-highlight'
import { useRouter } from 'next/router'
import Loader from '@/components/sites/Loader'

const serialize = (node) => {
  if (Text.isText(node)) {
    if (node.code) {
      return <Highlight className="h-full">{node.text}</Highlight>
    }
    if (node['heading-one']) {
      return (
        <h1 className="text-3xl font-cal md:text-6xl mb-10 text-gray-800">
          {node.text}
        </h1>
      )
    }

    if (node.bold && node.italic) {
      return <p className="font-bold italic font-cal">{node.text}</p>
    }

    if (node.bold) {
      return <p className="font-bold font-cal">{node.text}</p>
    }

    if (node.italic) {
      return <p className="font-italic font-cal">{node.text}</p>
    }

    if (node['heading-two']) {
      return <p className="text-2xl font-cal">{node.text}</p>
    }

    return node.text
  }

  const children = node?.children.map((n) => serialize(n))

  switch (node.type) {
    case 'block-quote':
      return <blockquote>{children}</blockquote>
    case 'italic':
      return <em className="italic">{children}</em>
    case 'underline':
      return <p className="underline">{children}</p>

    case 'heading-one':
      return <h1 className="text-4xl">{children}</h1>
    case 'heading-two':
      return <h2 className="text-2xl">{children}</h2>
    case 'code':
      return <code className="bg-gray-50 p-2 m-2">{children}</code>

    case 'list-item':
      return <li>{children}</li>
    case 'numbered-list':
      return <ol>{children}</ol>
    default:
      return <p>{children}</p>
  }
}
export default function Post(props) {
  console.log(props)
  const router = useRouter()
  if (router.isFallback) {
    return <Loader />
  }

  const data = JSON.parse(props.stringifiedData)
  console.log(data)
  // const adjacentPosts = JSON.parse(props.stringifiedAdjacentPosts);

  const meta = {
    title: data.title,
    description: data.description,
    ogUrl: `https://${data.site.subdomain}.vercel.im/${data.slug}`,
    ogImage: data.image,
    logo: '/logo.png',
  }

  return (
    <Layout meta={meta} subdomain={data.site.subdomain}>
      <div className="flex flex-col justify-center items-center">
        <div className="text-center w-full md:w-7/12 m-auto">
          <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
            <Date dateString={data.createdAt} />
          </p>
          <h1 className="font-bold text-3xl font-cal md:text-6xl mb-10 text-gray-800">
            {data.title}
          </h1>
          <p className="text-md md:text-lg text-gray-600 w-10/12 m-auto">
            {data.description}
          </p>
        </div>
      </div>
      <div className="relative h-80 md:h-150 w-full max-w-screen-lg lg:2/3 md:w-5/6 m-auto mb-10 md:mb-20 md:rounded-2xl overflow-hidden">
        <BlurImage
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash}
          src={data.image}
        />
      </div>

      <article className="w-11/12 sm:w-3/4 m-auto prose prose-md sm:prose-lg">
        {data.content.map(serialize)}
      </article>

      {/* {adjacentPosts.length > 0 && (
        <div className="relative mt-10 sm:mt-20 mb-20">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">
              Continue Reading
            </span>
          </div>
        </div>
      )}
      {adjacentPosts && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 mx-5 lg:mx-12 2xl:mx-auto mb-20 max-w-screen-xl">
          {adjacentPosts.map((data, index) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )} */}
    </Layout>
  )
}

export async function getStaticPaths() {
  const { data } = await supabase.from('post').select(
    `slug,
  site (
    subdomain,
    customDomain
  )  
  `
  )

  return {
    paths: data.flatMap((post) => {
      const params = []

      if (post.site.subdomain) {
        params.push({ params: { site: post.site.subdomain, slug: post.slug } })
      }

      if (post.site.customDomain) {
        params.push({
          params: { site: post.site.customDomain, slug: post.slug },
        })
      }
      return params
    }),
    fallback: true,
  }
}

export async function getStaticProps({ params: { site, slug } }) {
  const { data } = await supabase
    .from('post')
    .select(
      `*,
    site (
      subdomain,
      customDomain
    )
    `
    )
    .eq('slug', slug)

  if (data.length === 0) {
    return { notFound: true, revalidate: 10 }
  }

  return {
    props: {
      stringifiedData: JSON.stringify(data[0]),
    },
    revalidate: 10,
  }
}
