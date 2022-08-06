import sluga from 'sluga'

const SEP = '/'

const slugifyCache = new Map<string, string>()

/**
 * Generates a slug for based on the given string.
 *
 * @param str - The string to slugify
 * @returns
 */
function slugify(str: string) {
  let val = slugifyCache.get(str)

  if (!val) {
    val = sluga(str)
    slugifyCache.set(str, val)
  }

  return val
}

/**
 * Generates a test id that can be used in `data-testid` attributes.
 *
 * @param scopes - descriptions of the scopes that'll form the test id
 * @returns A valid `data-testid` value
 */
function generateTestId(...scopes: (string | string[])[]): string {
  // We create the test id in one loop to avoid the JS impact of adding
  // test ids everywhere in pages.
  // Transforms ['a', 'b', ['c', 'd']] into 'a/b/c/d'
  return scopes.reduce<string>((tid, scope) => {
    if (!scope.length) return tid
    if (Array.isArray(scope)) {
      return generateTestId(tid, ...scope)
    }
    return `${tid}${tid && SEP}${slugify(scope)}`
  }, '')
}

export const tid = generateTestId
