import React from 'react'
import fetchAPI from '@lib/fetch-api'
import useSWR from 'swr'
import { Layout, Button, Input, Text } from '@edge-functions/ui'

function Index() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [ip, setIp] = React.useState<string>('')

  const { data: rules, error, mutate } = useSWR<Array<any>>('/rules')

  const handleBlock = async () => {
    setLoading(true)
    await fetchAPI('/rules/add', 'POST', { ip, rule_response: 'block' })
    await mutate()
    setLoading(false)
  }

  const handleRemove = async (ruleId: string) => {
    await fetchAPI(`/rules/remove?id=${ruleId}`, 'DELETE')
    mutate()
  }

  return (
    <div className="w-full max-w-3xl mx-auto pt-16 mb-4">
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          IP Blocking with Datadome
        </Text>
        <Text>
          With <i className="font-semibold">Vercel's Edge Middleware</i> we're
          able to excecute functions at the edge level and act on mid-flight
          requests instantly. This example uses DataDome's low-latency Custom
          Rules API that allows us to block certain IPs.
        </Text>
      </div>
      <div className="flex py-8">
        <Input
          onChange={({ currentTarget: { value } }) => setIp(value)}
          placeholder="IP"
        />
        <Button
          onClick={handleBlock}
          style={{ marginLeft: '1rem' }}
          width="120px"
          loading={loading}
        >
          Block IP
        </Button>
      </div>
      <div>
        {rules ? (
          <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
            {rules.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-content py-6 px-6"
              >
                <span className="flex-1">
                  <h3 className="font-semibold text-black">{r.query}</h3>
                  <p className="font-medium text-accents-4">
                    {r.rule_response}
                  </p>
                </span>
                <span className="w-48 flex justify-end">
                  <Button
                    onClick={() => handleRemove(r.id)}
                    size="sm"
                    variant="secondary"
                  >
                    Remove Rule
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div>Failed to load rules</div>
        ) : (
          <div>Loading Rules...</div>
        )}
      </div>
    </div>
  )
}

Index.Layout = Layout

export default Index
