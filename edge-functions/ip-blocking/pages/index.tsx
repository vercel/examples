import { useState } from 'react'
import useSWR from 'swr'
import {
  Layout,
  Page,
  Button,
  Input,
  Text,
  Link,
  Code,
} from '@vercel/examples-ui'
import fetchAPI from '@lib/fetch-api'

function Index() {
  const [loading, setLoading] = useState<boolean>(false)
  const { data, error, mutate } = useSWR('/api/rules/ip')
  const { myIp, rules } = data || {}

  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          IP Blocking with Upstash
        </Text>
        <Text className="mb-4">
          With <i className="font-semibold">Vercel&apos;s Edge Middleware</i>{' '}
          we&apos;re able to execute functions at the edge level and act on
          mid-flight requests instantly. This example uses Upstash for API rate
          limiting and to add rules that allows us to block certain IPs.
        </Text>
        <Text>
          Add IPs to block them below, next go to{' '}
          <Link href="/am-i-blocked" prefetch={false}>
            /am-i-blocked
          </Link>{' '}
          under the IP and it&apos;ll be blocked. Your IP is:{' '}
          <Code>{myIp}</Code>.
        </Text>
      </div>

      <form
        className="flex py-8"
        onSubmit={async (e) => {
          e.preventDefault()

          const form: any = e.target
          const ip = form.ip.value

          setLoading(true)
          await fetchAPI('/rules/ip', {
            method: 'PUT',
            data: { ip, action: 'block' },
          }).finally(() => {
            setLoading(false)
            form.reset()
          })
          await mutate()
        }}
      >
        <Input name="ip" placeholder={myIp || 'IP'} />
        <Button type="submit" className="ml-4" width="120px" loading={loading}>
          Block IP
        </Button>
      </form>

      <div>
        {rules ? (
          rules.length ? (
            <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
              {rules.map(([ip, { action }]: any) => (
                <li
                  key={ip}
                  className="flex items-center justify-content py-6 px-6"
                >
                  <span className="flex-1">
                    <h3 className="font-semibold text-black">{ip}</h3>
                    <p className="font-medium text-accents-4">{action}</p>
                  </span>
                  <span className="w-48 flex justify-end">
                    <Button
                      onClick={async () => {
                        await fetchAPI(`/rules/ip?ip=${ip}`, {
                          method: 'DELETE',
                        })
                        await mutate()
                      }}
                      size="sm"
                      variant="secondary"
                    >
                      Remove Rule
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null
        ) : error ? (
          <div>Failed to load rules</div>
        ) : (
          <div>Loading Rules...</div>
        )}
      </div>
    </Page>
  )
}

Index.Layout = Layout

export default Index
