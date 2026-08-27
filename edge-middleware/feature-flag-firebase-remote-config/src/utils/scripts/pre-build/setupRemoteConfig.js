const fs = require('fs')
const path = require('path')
const admin = require('firebase-admin')
const prettier = require('prettier')

async function createStaticFile() {
  const fullFilePath = path.join(
    process.cwd(),
    'src/utils/scripts/pre-build',
    'rc-prefetched-data.json'
  )

  const serviceAccount = {
    type: 'service_account',
    project_id: 'testing-8c23b',
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY
      ? process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
      : '',
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  const getRemoteConfig = async () => {
    let config = admin.remoteConfig()
    const template = await config.getTemplate()
    return template.parameters
  }

  const res = await getRemoteConfig()

  const resArray = Object.entries(res)

  const data = resArray.map((item) => {
    const [name, parameters] = item
    return {
      name: name,
      parameters: parameters,
    }
  })

  const content = prettier.format(JSON.stringify(data), { parser: 'json' })

  if (fs.existsSync(fullFilePath)) {
    await fs.promises.unlink(fullFilePath)
  }

  await fs.promises.writeFile(fullFilePath, content)
}

module.exports = { createStaticFile }
