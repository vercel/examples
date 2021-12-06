const fs = require('fs');
const fetch = require('node-fetch');

const DATAFILE_DIR = './lib/optimizely'

function withOptimizely(nextConfig) {
  const sdkKey = process.env.OPTIMIZELY_SDK_KEY;
  console.log(sdkKey);

  (async () => {
    console.log('---------------')
    const response = await fetch(`https://cdn.optimizely.com/datafiles/${sdkKey}.json`);
    const responseJson = await response.text();
    if (!fs.existsSync(DATAFILE_DIR)){
        fs.mkdirSync(DATAFILE_DIR, { recursive: true });
    }
    fs.writeFileSync(`${DATAFILE_DIR}/datafile.json`, responseJson);
  })();
  
  return nextConfig;
}

module.exports = withOptimizely;
