import { ACCESS_TOKEN, CONTENT_TYPE, ENV_PATH } from './constants.mjs'
import initContentful from './index.mjs'

// List of the fields we'll use to create an entry for the template in Contentful.
const FIELDS = [
  'name',
  'slug',
  'description',
  'framework',
  'type',
  'css',
  'deployUrl',
  'demoUrl',
  'publisher',
  'relatedTemplates',
]

export default async function validateTemplate(template: any) {
  const contentful = initContentful(ACCESS_TOKEN)
  // Ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types/content-type/get-a-single-content-type/console/curl
  const contentType = await contentful(
    `${ENV_PATH}/content_types/${CONTENT_TYPE}`
  )
  const fields = contentType.fields.filter(({ id }) => FIELDS.includes(id))
  const errors = []

  // console.log('CONTENT_TYPE', JSON.stringify(contentType, null, 2))

  fields.forEach(({ id, type, required, validations, items }) => {
    const val = template[id]

    if (required && !val?.length) {
      errors.push(new Error(`Missing required template field: "${id}"`))
      return
    }

    if (type === 'Text' && typeof val !== 'string') {
      errors.push(new Error(`"${id}" must be a string`))
      return
    }

    if (validations?.length) {
      validations.forEach(({ size, regexp }) => {
        if (size) {
          const { min, max } = size

          if (val.length < min || val.length > max) {
            errors.push(
              new Error(
                `"${id}" should have a value between ${min} and ${max} characters, currently: "${val}" (${val.length})`
              )
            )
            return
          }
        }

        if (regexp) {
          const regex = new RegExp(regexp.pattern)
          if (!regex.test(val)) {
            errors.push(
              new Error(
                `"${id}" with value "${val}" doesn't match the regex "${regexp.pattern}`
              )
            )
            return
          }
        }
      })
    }

    if (type === 'Array') {
      if (!Array.isArray(val)) {
        errors.push(new Error(`"${id}" must be an array`))
        return
      }

      items?.validations?.forEach((validation) => {
        if (
          validation.in?.length &&
          !val.every((item) => validation.in.includes(item))
        ) {
          errors.push(
            new Error(
              `"${id}" has an unknown item: "${val.join(
                ', '
              )}", it must be one of "${validation.in.join(', ')}`
            )
          )
          return
        }
      })
    }
  })

  if (errors.length) {
    console.error('Template validation failed:')
    throw errors
  }

  return template
}
