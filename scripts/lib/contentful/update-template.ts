import path from 'path'
import { ACCESS_TOKEN, CONTENT_TYPE, ENV_PATH } from './constants'
import log from '../log.mjs'
import getReadme from '../get-readme.mjs'
import getFrontMatter from './get-front-matter'
import initContentful from './index'
import validateTemplate from './validate-template'

type Patch = {
  op: 'add' | 'replace'
  path: string
  value: string | string[] | AddValue
}

type AddValue = { [lang: string]: string | string[] }

export default async function updateTemplate({
  lang,
  examplePath,
}: {
  lang: string
  examplePath: string
}) {
  const contentful = initContentful(ACCESS_TOKEN)
  const readme = await getReadme(examplePath)

  if (!readme) {
    throw new Error('No readme.md found in example directory')
  }

  const { body: readmeBody, attributes } = getFrontMatter(readme)

  if (!attributes) {
    log(`Ignoring "${examplePath}" because it has Marketplace disabled.`)
    return
  }

  attributes.githubUrl = `https://github.com${path.join(
    '/vercel/examples/tree/main',
    examplePath
  )}`

  log(`Fetching template with slug "${attributes.slug}"...`)

  // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/entries/entry/get-a-single-entry/console/curl
  // Search params: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters
  // The entry is the "Template" we want to update
  const entryRes = await contentful(
    `${ENV_PATH}/entries?content_type=${CONTENT_TYPE}&fields.slug=${attributes.slug}`
  )
  const entry = entryRes?.items[0]
  // console.log('ENTRY', JSON.stringify(entryRes, null, 2))

  // If the `content_type` doesn't exist or doesn't have the `slug` field
  // Contentful returns a `400`  and we'll throw an error, so we can assume
  // that it exists and it's valid from here on

  // Update the template
  if (entry) {
    const { fields } = entry
    const template = await validateTemplate(attributes)
    const body = Object.entries(template).reduce<Patch[]>(
      (patch, [field, value]: [string, string | string[]]) => {
        const currentValue = fields[field]?.[lang]

        // Update existing field
        if (currentValue) {
          if (
            Array.isArray(currentValue) && Array.isArray(value)
              ? value.length !== currentValue.length ||
                value.some((val) => !currentValue.includes(val))
              : currentValue !== value
          ) {
            patch.push({
              op: 'replace',
              path: `/fields/${field}/${lang}`,
              value,
            })
          }
        }
        // Add a new field
        else {
          // When adding a field the lang has to be part of `value` even if docs say otherwise.
          patch.push({
            op: 'add',
            path: `/fields/${field}`,
            value: { [lang]: value },
          })
        }

        return patch
      },
      []
    )

    if (!body.length) {
      log('No changes to make in this entry.')
      return
    }

    log(
      `Updating the template "${template.slug}" with:`,
      JSON.stringify(body, null, 2)
    )

    // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/entries/entry/patch-an-entry/console/curl
    const updatedEntry = await contentful(
      `${ENV_PATH}/entries/${entry.sys.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
          'X-Contentful-Version': entry.sys.version,
        },
        body: JSON.stringify(body),
      }
    )

    log('Updated entry!')

    if (updatedEntry.sys.version < entry.sys.version) return

    // If the entry was updated successfully, we'll publish it.
    // Right now we don't validate fields, so this can fail with a 422
    // if some fields are missing.
    const publishedEntry = await contentful(
      `${ENV_PATH}/entries/${entry.sys.id}/published`,
      {
        method: 'PUT',
        headers: {
          'X-Contentful-Version': updatedEntry.sys.version,
        },
        body: JSON.stringify(body),
      }
    )

    if (publishedEntry.sys.version > updatedEntry.sys.version) {
      log('Entry published successfully!')
    }
  }
  // Create a new template as a draft
  else {
    // If not template was found, we fetch the Environment to validate that both the Space
    // and the Environment exist before trying to create a new template and report back
    // if there's a wrong Environment/Space variable set
    const environment = await contentful(ENV_PATH)

    if (!environment) {
      throw new Error(`No Space or Environment was found for \`${ENV_PATH}\``)
    }

    // For new templates we'll use the readme as the initial overview
    attributes.overview = readmeBody

    const template = await validateTemplate(attributes)

    log(`Creating a new template with: ${JSON.stringify(template, null, 2)}`)

    const fields = Object.entries(template).reduce<Record<string, AddValue>>(
      (fields, [field, value]) => {
        fields[field] = { [lang]: value }
        return fields
      },
      {}
    )

    // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/entries/entry/create-update-an-entry/console/curl
    // To add a new entry we use POST because it doesn't work with PUT as Contentful says
    const newEntry = await contentful(`${ENV_PATH}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': CONTENT_TYPE,
      },
      body: JSON.stringify({ fields }),
    })

    log('Created a new entry:', JSON.stringify(newEntry, null, 2))
  }
}
