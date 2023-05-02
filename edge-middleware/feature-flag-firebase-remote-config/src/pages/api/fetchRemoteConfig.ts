import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { FIREBASE_SERVICE_ACCOUNT } from 'src/utils/const'

const serviceAccount = FIREBASE_SERVICE_ACCOUNT

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fetched = await getRemoteConfig()

  const resArray = Object.entries(fetched)

  const data = resArray.map((item) => {
    const [name, parameters] = item
    return {
      name: name,
      parameters: parameters,
    }
  })

  res.status(200).json(data)
}
