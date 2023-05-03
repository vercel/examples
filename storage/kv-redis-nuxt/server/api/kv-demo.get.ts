import kv from '@vercel/kv'

export default defineEventHandler(async () => {
  let pageVisits = (await kv.get('pageVisits')) as number
  const updatedPageVisits = pageVisits + 1
  await kv.set('pageVisits', updatedPageVisits)
  return {
    pageVisits: updatedPageVisits,
  }
})
