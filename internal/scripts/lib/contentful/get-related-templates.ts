import initContentful from '.'
import { ACCESS_TOKEN, CONTENT_TYPE, ENV_PATH } from './constants'

export default async function getRelatedTemplates(slug: string[]) {
  const contentful = initContentful(ACCESS_TOKEN)
  // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/entries/entry/get-a-single-entry/console/curl
  // Search params: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters
  // The entry is the "Template" we want to update
  const entryRes = await contentful(
    `${ENV_PATH}/entries?content_type=${CONTENT_TYPE}&fields.slug[in]=${slug}`
  )
  return entryRes?.items
}
