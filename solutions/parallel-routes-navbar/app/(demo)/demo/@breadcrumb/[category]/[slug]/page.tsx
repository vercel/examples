const DATA = {
  'key-lime-pie': 'Key Lime Pie',
  'pumpkin-pie': 'Pumpkin Pie',
  'apple-pie': 'Apple Pie',
}

export default async function BreadcrumbPage({
  params: { category, slug },
}: {
  params: { category: string; slug: string }
}) {
  const displayName = await new Promise<string>((resolve) =>
    setTimeout(
      () => resolve(DATA[slug as keyof typeof DATA] || 'Secret recipe'),
      1000
    )
  )

  return (
    <nav className="flex gap-4 text-sm opacity-80">
      <span className="capitalize">{` > ${category}`}</span>
      <span> / </span>
      <span>{displayName}</span>
    </nav>
  )
}
