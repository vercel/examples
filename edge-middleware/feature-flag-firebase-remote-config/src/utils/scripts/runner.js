const pkg = require('@next/env')
const fs = require('fs')
const path = require('path')
const { loadEnvConfig } = pkg
loadEnvConfig(process.cwd())

const runAsync = async () => {
  const files = fs
    .readdirSync(path.join(__dirname, 'pre-build'))
    .filter((file) => file.endsWith('.js'))
    .sort()

  for (const file of files) {
    const { createStaticFile: defaultFunc } =
      await require(`./pre-build/${file}`)

    try {
      console.log(`SCRIPT RUNNER: Running pre-build script '${file}'`)
      await defaultFunc({ env: process.env })
    } catch (e) {
      console.error(
        `SCRIPT RUNNER: Failed to execute pre-build script '${file}'`
      )
      console.error(e)
    }
  }
}

// Self-invocation async function
;(async () => {
  await runAsync().then(() => {
    console.log('SCRIPT RUNNER: Done running all pre-build scripts.')
  })
})().catch((err) => {
  console.error(err)
  throw err
})
