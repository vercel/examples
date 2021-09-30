import { Code, Page, Headers } from '@components'

export default function Blocked() {
  return (
    <Page>
      <h1>Bot Protection with Botd (by FingerprintJS)</h1>
      <p>
        You should never see this page! Why? Because we intentionally change the
        user agent to match a bot, and then our edge will rewrite your request
        to /bot-detected
      </p>
    </Page>
  )
}
