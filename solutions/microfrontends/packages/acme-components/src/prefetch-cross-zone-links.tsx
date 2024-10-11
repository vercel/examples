import Script from 'next/script'

/**
 * Component that prefetches and prerenders cross-zone links using the
 * Speculation Rules API: https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API.
 *
 * Since it is a hard navigation when a user crosses between zones, this
 * component can reduce the performance impact of that navigation by making
 * sure that the cross-zone links on the page are prefetched and/or prerendered
 * before the user clicks on them.
 */
export function PrefetchCrossZoneLinks({
  hrefs,
}: {
  hrefs: string[]
}): JSX.Element | null {
  // Prefetch links when the user hovers over them and prerender the link
  // when the pointerdown event is received.
  const speculationRules = {
    prefetch: [{ source: 'list', eagerness: 'moderate', urls: [...hrefs] }],
    prerender: [
      { source: 'list', eagerness: 'conservative', urls: [...hrefs] },
    ],
  }

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: `${JSON.stringify(speculationRules)}`,
      }}
      id="prefetch-cross-zones-links"
      type="speculationrules"
    />
  )
}
