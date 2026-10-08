/**
 * Live check of the AI access: asks one question on every available platform
 * and runs the brand extraction on the first answer. Spends a few cents.
 *
 *   npm run smoke -- "best running shoes for flat feet" "Nike" "nike.com"
 */
import { config as loadEnv } from 'dotenv'

loadEnv({ path: ['.env.local', '.env'], quiet: true })

async function main(): Promise<void> {
  const [
    { queryPlatform },
    { extractBrands },
    { availablePlatforms, extractorAvailability, transport },
    { platformModelId },
  ] = await Promise.all([
    import('@/lib/ai/query'),
    import('@/lib/ai/extract'),
    import('@/lib/ai/provider'),
    import('@/lib/platforms'),
  ])

  const question =
    process.argv[2] ??
    'What are the best tools to track how AI assistants mention a brand?'
  const brandName = process.argv[3] ?? 'Searcherries'
  const brandDomain = process.argv[4] ?? 'searcherries.com'
  const platforms = availablePlatforms()
  console.log(
    `Transport: ${transport()} · platforms: ${platforms.join(', ') || 'none'}`
  )
  if (platforms.length === 0) {
    console.error(
      'No platform is available. Set AI_GATEWAY_API_KEY (or vendor keys) in .env.local.'
    )
    process.exit(1)
  }

  let firstAnswer: { text: string; sources: string[] } | null = null
  for (const platform of platforms) {
    const result = await queryPlatform({
      platform,
      question,
      country: null,
      language: null,
    })
    if (!result.ok) {
      console.log(
        `✗ ${platform} (${platformModelId(platform)}): ${result.error}`
      )
      continue
    }
    console.log(
      `✓ ${platform} (${result.providerModelId ?? result.modelId}) ${
        result.durationMs
      } ms · ${result.text.length} chars · ${result.sources.length} sources`
    )
    for (const source of result.sources.slice(0, 3))
      console.log(`    ${source.url}`)
    if (result.searchQueries.length > 0)
      console.log(`    searches: ${result.searchQueries.join(' | ')}`)
    firstAnswer ??= {
      text: result.text,
      sources: result.sources.map((s) => s.url),
    }
  }

  const extractor = extractorAvailability()
  if (!firstAnswer || !extractor.available) {
    console.log(
      `Extraction skipped: ${extractor.reason ?? 'no successful answer'}`
    )
    return
  }
  const brands = await extractBrands({
    question,
    answerText: firstAnswer.text,
    citations: firstAnswer.sources,
    brandName,
    brandAliases: [],
    brandDomain,
  })
  console.log(`Extraction (${extractor.modelId}): ${brands.length} brands`)
  for (const brand of brands) {
    console.log(
      `  ${brand.isSelf ? '★' : '·'} ${brand.name} [${brand.key}] ${
        brand.sentiment
      }${brand.recommended ? ', recommended' : ''}${
        brand.website ? ` ${brand.website}` : ''
      }`
    )
    for (const h of brand.highlights) console.log(`      – ${h}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
