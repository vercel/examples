/**
 * List of known active Splits
 */
export const SPLITS = {
  about: 'New_About_Page',
  marketing: 'New_Marketing_Page',
} as const

export type SPLITS = typeof SPLITS[keyof typeof SPLITS]

/**
 * Sends an event to Split.io
 *
 * This method works for both the server (including Edge Middleware) and browser
 */
export async function track(
  key: string,
  trafficType: string,
  eventType: string,
  value?: number | null,
  properties?: Record<string, any>
) {
  const start = Date.now()
  const res = await fetch(`https://events.split.io/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SPLIT_SDK_CLIENT_API_KEY}`,
    },
    body: JSON.stringify({
      key,
      trafficTypeName: trafficType,
      eventTypeId: eventType,
      environmentName: process.env.SPLIT_ENVIRONMENT_ID,
      value: value ?? null,
      timestamp: Date.now(),
      ...(properties ? { properties } : {}),
    }),
  })

  if (!res.ok) {
    const contentType = res.headers.get('Content-Type')
    const data = contentType.includes('application/json')
      ? await res.json()
      : await res.text()

    throw new Error(
      `Fetch request to send an event to Split failed with: (${
        res.status
      }) ${JSON.stringify(data, null, 2)}`
    )
  }

  const end = Date.now()

  console.log(`TRACK: ${end - start} ms`)
}
