import { unstable_flag as flag } from '@vercel/flags/next'
import getHypertune from '../lib/getHypertune'

export const exampleFlag = flag<boolean>({
  key: 'exampleFlag',
  defaultValue: false,
  origin:
    'https://app.hypertune.com/projects/3385/draft?view=logic&selected_field_path=root%3EexampleFlag',
  options: [
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ],

  async decide(params) {
    const hypertune = await getHypertune(params)
    return hypertune.exampleFlag({ fallback: false })
  },
})
