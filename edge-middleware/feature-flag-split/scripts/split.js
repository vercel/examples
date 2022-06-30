const { join } = require('path')
const { writeFile } = require('fs/promises')
const prettier = require('prettier')

// Fetch the list of Splits and save them to a JSON. Using a SDK here is not necessary
async function setupSplit() {
  const res = await fetch(
    `https://api.split.io/internal/api/v2/splits/ws/${process.env.SPLIT_WORKSPACE_ID}/environments/${process.env.SPLIT_ENVIRONMENT_ID}?limit=50`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SPLIT_ADMIN_API_KEY}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error(
      `Fetch request to retrieve the list of splits failed with: (${res.status}) ${res.statusText}`
    )
  }

  const data = await res.json()
  const filePath = join(process.cwd(), 'lib/splits.json')
  const content = prettier.format(JSON.stringify(data), { parser: 'json' })

  await writeFile(filePath, content)
}

function withSplit(nextConfig = {}) {
  const { rewrites } = nextConfig
  // Not really adding rewrites but using its async behavior to load the config from Split
  nextConfig.rewrites = async (...args) => {
    await setupSplit()
    return rewrites?.(...args) ?? {}
  }

  return nextConfig
}

module.exports = { withSplit, setupSplit }
