import { Layout } from '@vercel/examples-ui'
import SwrResponse from '@components/swr-response'
import Explainer from '@components/Explainer'

export default function Protected() {
  return <Explainer />
}

Protected.Layout = Layout
