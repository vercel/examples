/**
 * Optional: a push notification to your phone when a generation finishes,
 * through Lauther (https://lauther.app). A build can run for minutes; set
 * LAUTHER_TOKEN and the platform tells you when the preview is ready, with
 * the preview URL as the tap target. Unset, this is a no-op.
 */
export async function notifyPhone(input: {
  title: string
  message?: string
  url?: string
}): Promise<void> {
  const token = process.env.LAUTHER_TOKEN
  if (!token) return
  try {
    await fetch('https://api.lauther.id/v1/push', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
  } catch (error) {
    console.error('Phone notification failed', error)
  }
}
