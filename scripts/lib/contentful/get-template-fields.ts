import initContentful from '.'
import { ACCESS_TOKEN, CONTENT_TYPE, ENV_PATH } from './constants'
import type { Template } from './types'

// List of the fields we'll use to create an entry for the template in Contentful.
const FIELDS: (keyof Template)[] = [
  'name',
  'slug',
  'description',
  'framework',
  'type',
  'css',
  'githubUrl',
  'deployUrl',
  'demoUrl',
  'publisher',
  'relatedTemplates',
]

type Field = {
  id: string
  type: 'Symbol' | 'Text' | 'Array'
  required: boolean
  validations: {
    size?: { min: number; max: number }
    regexp?: { pattern: string }
  }[]
  items?: {
    type: 'Symbol' | 'Link'
    validations: { in?: string[] }[]
  }
}

type TemplateFields = ({ id: keyof Template } & Field)[]

export default async function getTemplateFields() {
  const contentful = initContentful(ACCESS_TOKEN)
  // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types/content-type/get-a-single-content-type/console/curl
  const contentType = (await contentful(
    `${ENV_PATH}/content_types/${CONTENT_TYPE}`
  )) as { fields: TemplateFields }
  const fields = contentType.fields.filter(({ id }) => FIELDS.includes(id))

  return fields
}
