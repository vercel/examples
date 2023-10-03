import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN!
export const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!
export const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT!
export const CONTENT_TYPE = process.env.CONTENTFUL_CONTENT_TYPE!

if (!ACCESS_TOKEN) {
  throw new Error(
    'The env variable CONTENTFUL_ACCESS_TOKEN is not set in .env.local.'
  )
}
if (!SPACE_ID) {
  throw new Error(
    'The env variable CONTENTFUL_SPACE_ID is not set in .env.local.'
  )
}
if (!ENVIRONMENT) {
  throw new Error('The env variable ENVIRONMENT is not set in .env.local.')
}
if (!CONTENT_TYPE) {
  throw new Error(
    'The env variable CONTENTFUL_CONTENT_TYPE is not set in .env.local.'
  )
}

// Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/environments/environment/get-a-single-environment/console/curl
export const ENV_PATH = `/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`
