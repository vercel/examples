import { randomUUID } from 'crypto'

export default async function globalSetup() {
  if (process.env.APPLITOOLS_API_KEY) {
    process.env.APPLITOOLS_BATCH_ID = randomUUID()
  } else {
    console.warn('Applitools API key not found. Skipping visual tests.')
  }
}
