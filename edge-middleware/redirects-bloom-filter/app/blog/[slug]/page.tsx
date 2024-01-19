import { Text } from '@vercel/examples-ui'

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <h1 className="text-6xl font-bold">Blog Post</h1>
      <Text className="mt-10">
        This is a basic blog post that should redirect from{' '}
        <strong>/should-render-basic-blog-post</strong> to{' '}
        <strong>/{params.slug}</strong>.
      </Text>
    </>
  )
}
