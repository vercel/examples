export const STATSIG_URL = 'https://api.statsig.com/v1'

type Experiment = {
  name: string
  value: {
    name: string
  }
  group: string
  rule_id?: string
}

// Initialize headers
const headers = new Headers()

// Set api key for statsig
headers.set(
  'statsig-api-key',
  process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY as string
)

// Set content-type
headers.set('Content-Type', 'application/json')

const api = {
  getGroups: async () => ['a', 'b'],
  getExperiment: (
    userID: string,
    experiment: string,
    defaultGroup: string = 'a'
  ): Promise<string> => {
    // Call the api
    return fetch(`${STATSIG_URL}/get_config`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user: {
          userID,
        },
        configName: experiment,
      }),
    })
      .then((res) => res.json() as Promise<Experiment>)
      .then(({ value }) => value.name || defaultGroup)
  },
  logExposure: (userID: string, group: string, experiment: string) => {
    return fetch(`${STATSIG_URL}/log_custom_exposure`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        exposures: [
          {
            user: {
              userID,
            },
            experimentName: experiment,
            group,
          },
        ],
      }),
    })
  },
}

export default api
