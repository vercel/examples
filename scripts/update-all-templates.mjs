import log from './lib/log.mjs'

const DIRS = ['edge-functions', 'solutions']

async function updateAllTemplates() {
  const promises = DIRS.map(async (dirPath) => {
    log(`Updating all templates in ${dirPath}...`)
  })
}
