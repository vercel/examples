import path from 'path'
import dotenv from 'dotenv'
import initContentful from './lib/contentful.mjs'
import getReadme from './lib/get-readme.mjs'
import getTemplate from './lib/get-template.mjs'

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

const log = (...args) => {
  if (process.env.DEBUG !== '0') {
    console.log(...args)
  }
}
const examplePath = process.argv[2]
const contentful = initContentful(ACCESS_TOKEN)

async function updateTemplate() {
  const readme = await getReadme(examplePath)

  if (!readme) {
    throw new Error('No readme.md found in example directory')
  }

  const { body: readmeBody, template } = getTemplate(readme)

  if (!template) {
    log(`Ignoring "${examplePath}" because it has Marketplace disabled.`)
    return
  }

  template.githubUrl = `https://github.com${path.join(
    '/vercel/examples/tree/main',
    examplePath
  )}`

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
            ? value.length !== currentValue.length ||
              value.some((val) => !currentValue.includes(val))
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

    log('Updated entry!')

    if (updatedEntry.sys.version < entry.sys.version) return

    // If the entry was updated successfully, we'll publish it.
    // Right now we don't validate fields, so this can fail with a 422
    // if some fields are missing.
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
  }
  // Create a new template as a draft
  else {
    log(`Creating a new template with: ${JSON.stringify(template, null, 2)}`)

    // For new templates we'll use the readme as the initial overview
    template.overview = readmeBody

    const fields = Object.entries(template).reduce((fields, [field, value]) => {
      fields[field] = { [LANG]: value }
      return fields
    }, {})

    // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/entries/entry/create-update-an-entry/console/curl
    // To add a new entry we use POST because it doesn't work with PUT as Contentful says
    const newEntry = await contentful(`${envPath}/entries`, {
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

updateTemplate().catch((err) => {
  console.error(err)
  process.exit(1)
})
