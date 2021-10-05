import { PARITIES } from './constants'
import { Country } from './types'

export default {
  parity: {
    list: async (): Promise<Country[]> => Object.keys(PARITIES) as Country[],
    fetch: async (country: Country): Promise<number> => {
      return PARITIES[country] || 10
    },
  },
}
