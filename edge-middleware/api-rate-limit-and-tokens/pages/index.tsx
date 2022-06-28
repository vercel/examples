import { useState } from 'react'
import useSWR from 'swr'
import { Layout, Page, Button, Text, Link } from '@vercel/examples-ui'
import fetchAPI from '@lib/fetch-api'
import ApiRequest from '@components/api-request'

function RateLimit() {
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedKey, setKey] = useState<string>('')
  const { data, error, mutate } = useSWR('/api/keys')
  const apiKeys = data?.apiKeys

  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          API Rate Limiting with Upstash
        </Text>
        <Text className="mb-4">
          With <i className="font-semibold">Vercel&apos;s Edge Middleware</i>{' '}
          we&apos;re able to do API rate limiting by keeping a counter of
          requests by IP or API token. For the demo below you can send a maximum
          of <b>5</b> requests every <b>10</b> seconds, which increases if using
          an API token.
        </Text>
      </div>

      <ApiRequest token={selectedKey} />

      <div className="grid">
        {apiKeys ? (
          apiKeys.length ? (
            <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
              {apiKeys.map(([key, { limit, timeframe }]: any) => (
                <li key={key} className="flex items-center justify-content p-6">
                  <span className="flex-1 mr-4 sm:mr-8">
                    <h3 className="text-sm font-semibold text-black break-all">
                      {key}
                    </h3>
                    <p className="font-medium text-accents-4">
                      {limit}req/{timeframe}s
                    </p>
                  </span>
                  <span className="flex justify-end flex-col sm:flex-row">
                    <Button
                      className="mb-2 sm:mr-2 sm:mb-0"
                      onClick={() => setKey(selectedKey === key ? '' : key)}
                      size="sm"
                      variant={selectedKey === key ? 'primary' : 'secondary'}
                    >
                      Use this key
                    </Button>
                    <Button
                      onClick={async () => {
                        await fetchAPI(`/keys?key=${key}`, { method: 'DELETE' })
                        await mutate()
                      }}
                      size="sm"
                      variant="secondary"
                    >
                      Remove
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null
        ) : error ? (
          <div>Failed to load API Keys</div>
        ) : (
          <div>Loading API Keys...</div>
        )}

        <Button
          type="button"
          className="sm:w-44 sm:justify-self-end"
          onClick={async () => {
            setLoading(true)
            await fetchAPI('/keys', { method: 'PUT' }).finally(() => {
              setLoading(false)
            })
            await mutate()
          }}
          loading={loading}
        >
          Add new API Key
        </Button>
      </div>
    </Page>
  )
}

RateLimit.Layout = Layout

export default RateLimit
