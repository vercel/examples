import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'
import { USER_TOKEN } from '@lib/constants'
import Explainer from '@components/Explainer'

export default function Index() {
  return <Explainer />
}

Index.Layout = Layout
