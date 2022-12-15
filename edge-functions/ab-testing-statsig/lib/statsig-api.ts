const STATSIG_URL = 'https://statsigapi.net'
const STATSIG_CONSOLE_API_KEY = process.env.STATSIG_CONSOLE_API_KEY!

/**
 * Fetch wrapper for the Statsig API
 */
async function statsig(
  path: string,
  method: string,
  { apiKey, data, ...init }: { apiKey: string; data?: any } & RequestInit
) {
  const url = new URL(STATSIG_URL)
  url.pathname = path

  if (!apiKey) {
    throw new Error('No Statsig API key was provided')
  }

  const res = await fetch(url.href, {
    ...init,
    method,
    headers: {
      'statsig-api-key': apiKey,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    body: JSON.stringify(data),
  })

  const resData = res.headers.get('Content-Type')!.includes('application/json')
    ? await res.json()
    : await res.text()

  if (res.ok) {
    return resData
  } else {
    throw new Error(
      `Statsig failed with (${res.status}): ${
        typeof resData === 'string' ? resData : JSON.stringify(resData, null, 2)
      }`
    )
  }
}

const api = {
  async getBuckets(experiment: string) {
    // https://docs.statsig.com/console-api/experiments#get-/experiments/-experiment_id-
    const experimentConfig = await statsig(
      `/console/v1/experiments/${experiment}`,
      'GET',
      { apiKey: STATSIG_CONSOLE_API_KEY }
    )

    return experimentConfig.data.groups.map(
      (group: { parameterValues: { bucket: string } }) =>
        group.parameterValues.bucket
    )
  },
}

export default api
