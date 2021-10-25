import { DICTIONARIES } from './constants'
import { Dictionary } from './types'

export default {
  dictionaries: {
    fetch: async (locale): Promise<Dictionary> =>
      DICTIONARIES[locale] || DICTIONARIES['default'],
  },
}
