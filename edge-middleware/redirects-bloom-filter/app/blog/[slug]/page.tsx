import { Text } from '@vercel/examples-ui'

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <h1 className="text-6xl font-bold">Blog Post</h1>
      <Text className="mt-10">/{params.slug}.</Text>
    </>
  )
}
