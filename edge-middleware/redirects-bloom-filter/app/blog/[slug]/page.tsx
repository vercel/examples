export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">Blog Post: {params.slug}</h1>
    </div>
  )
}
