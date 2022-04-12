import path from 'path'
import fs from 'fs/promises'
import { constants } from 'fs'
import createFetch from '@vercel/fetch'
import dotenv from 'dotenv'
import getReadme from './lib/get-readme.mjs'
import getTemplate from './lib/get-template.mjs'

/**
 * What's the plan here?
 *
 * Update templates after a PR is merged, for the template that changed.
 *
 * If the template doesn't exist yet, insert it as a Draft after a PR is merged.
 * It's likely that every template will require some manual updates before the
 * template is ready to be published.
 *
 * Allow certain templates to not be added.
 *
 * Have a way to update all of the templates in bulk, at least while we don't have
 * a way of using GH actions
 */

// Add the contentful API from `.env.local` to env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT
const CONTENT_TYPE = process.env.CONTENTFUL_CONTENT_TYPE
const LANG = 'en-US'

if (!ACCESS_TOKEN) {
  throw new Error('The env variable CONTENTFUL_ACCESS_TOKEN is not set.')
}
if (!SPACE_ID) {
  throw new Error('The env variable CONTENTFUL_SPACE_ID is not set.')
}
if (!CONTENT_TYPE) {
  throw new Error('The env variable CONTENTFUL_CONTENT_TYPE is not set.')
}

const fetch = createFetch()
const log = (...args) => {
  if (process.env.DEBUG !== '0') {
    console.log(...args)
  }
}
const DIRS = ['edge-functions', 'solutions', 'packages']
const examplePath = process.argv[2]

async function contentful(path, fetchOptions) {
  let res

  try {
    res = await fetch(`https://api.contentful.com${path}`, {
      ...fetchOptions,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        ...fetchOptions?.headers,
      },
    })
  } catch (err) {
    console.error(
      'There was a network error trying to fetch from Contentful:',
      err
    )
  }

  const body = await res.json()

  if (res.status === 404) return null
  if (res.status !== 200) {
    throw new Error(
      `Contentful returned a ${
        res.status
      } status code for \`${path}\` with:\n${JSON.stringify(body, null, 2)}`
    )
  }

  return body
}

log('Example path:', examplePath)

async function updateTemplate() {
  const readme = await getReadme(examplePath)

  if (!readme) {
    throw new Error('No readme.md found in example directory')
  }

  const template = getTemplate(readme)

  template.githubUrl = `https://github.com${path.join(
    '/vercel/examples/tree/main',
    examplePath
  )}`

  console.log('ATTS', template)

  const envPath = `/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`
  // We fetch the environment to validate that both the Space and the Environment exist
  const environment = await contentful(envPath)

  if (!environment) {
    throw new Error(`No space or environment was found for \`${envPath}\``)
  }

  log(`Fetching the entry with slug "${template.slug}"...`)

  // The entry is the "Template" we want to update
  const entryRes = await contentful(
    `${envPath}/entries?content_type=${CONTENT_TYPE}&fields.slug=${template.slug}`
  )
  const entry = entryRes?.items[0]

  console.log('ENTRY', JSON.stringify(entry, null, 2))

  // If the `content_type` doesn't exist Contentful returns a `400` and we'll
  // throw an error, so we can assume that it exists and it's valid from here on

  // Update the template
  if (entry) {
    const { fields } = entry
    // const body = { name, slug, description, framework, type, css, demoUrl }
    const body = Object.entries(template).reduce((patch, [field, value]) => {
      const currentValue = fields[field]?.[LANG]

      // Update existing field
      if (currentValue) {
        if (
          Array.isArray(currentValue)
            ? !currentValue.includes(value)
            : currentValue !== value
        ) {
          patch.push({
            op: 'replace',
            path: `/fields/${field}/${LANG}`,
            value,
          })
        }
      }
      // Add a new field
      else {
        patch.push({
          op: 'add',
          path: `/fields/${field}`,
          value: { [LANG]: value },
        })
      }

      return patch
    }, [])

    console.log('BODY', body)

    if (!body.length) {
      log('No changes to make in this entry.')
      return
    }

    const updatedEntry = await contentful(
      `${envPath}/entries/${entry.sys.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
          'X-Contentful-Version': entry.sys.version,
        },
        body: JSON.stringify(body),
      }
    )

    // If the entry was updated successfully, we'll publish it.
    if (updatedEntry.sys.version > entry.sys.version) {
      const publishedEntry = await contentful(
        `${envPath}/entries/${entry.sys.id}/published`,
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

      console.log('RES', publishedEntry)
    }
  }
  // Create a new template as a draft
  else {
    const overview = readme
    const newEntry = await contentful(`${envPath}/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': CONTENT_TYPE,
      },
      body: JSON.stringify({
        fields: Object.entries(template).reduce((fields, [field, value]) => {
          fields[field] = { [LANG]: value }
          return fields
        }, {}),
      }),
    })

    console.log('NEW ENTRY', newEntry)
  }
}

updateTemplate().catch((err) => {
  console.error(err)
  process.exit(1)
})
