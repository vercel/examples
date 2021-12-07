const fs = require('fs');
const fetch = require('node-fetch');

const DATAFILE_DIR = './lib/optimizely'

async function fetchDatafile() {
  const sdkKey = process.env.OPTIMIZELY_SDK_KEY;
  console.log(`Fetching Optimizely Datafile for SDK Key: ${sdkKey}`);

  const response = await fetch(`https://cdn.optimizely.com/datafiles/${sdkKey}.json`);
  const responseJson = await response.text();
  if (!fs.existsSync(DATAFILE_DIR)){
      fs.mkdirSync(DATAFILE_DIR, { recursive: true });
  }
  fs.writeFileSync(`${DATAFILE_DIR}/datafile.json`, responseJson);
  console.log(`Optimizely Datafile fetched successfully`);
}

function withOptimizely(nextConfig = {}) {
  const { rewrites } = nextConfig

  nextConfig.rewrites = async (...args) => {
    await fetchDatafile()
    return rewrites?.(...args) ?? {}
  }

  return nextConfig
}

module.exports = withOptimizely;
