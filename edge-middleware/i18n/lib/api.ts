import { DICTIONARIES } from './constants'
import { Dictionary } from './types'

const api = {
  dictionaries: {
    fetch: async (locale): Promise<Dictionary> =>
      DICTIONARIES[locale] || DICTIONARIES['default'],
  },
}

export default api
