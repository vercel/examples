import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'url'
import getTemplateFields from './lib/contentful/get-template-fields'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Writes a json file that describes the schema used for the Contentful template.
 */
async function updateFields() {
  const fields = await getTemplateFields()
  const data = fields.map((field) => ({
    name: field.id,
    type: field.type === 'Symbol' ? 'Text' : field.type,
    required: true,
    validations: field.validations,
    ...(field.items?.type === 'Symbol' || field.items?.type === 'Link'
      ? { items: field.items.validations }
      : {}),
  }))

  await fs.writeFile(
    // Goes back two paths because this script gets bundled to /scripts/dist
    path.join(__dirname, '../../fields.json'),
    JSON.stringify(data, null, 2)
  )
}

updateFields().catch((error) => {
  console.error(error)
  process.exit(1)
})
