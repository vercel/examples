import { merge } from 'hypertune'
import {
  HypertuneHydrator,
  HypertuneRootProvider,
} from '../generated/hypertune.react'
import getHypertune from '../lib/getHypertune'
import ClientComponent from './ClientComponent'

export default async function ClientComponentWrapper() {
  const hypertune = await getHypertune()

  const serverRootArgs = hypertune.getRootArgs()
  const serverDehydratedState = hypertune.dehydrate()

  return (
    <HypertuneRootProvider
      rootArgs={merge(
        serverRootArgs
        // Set real values for browser-only args, e.g.
        // { context: { browserOnlyId: "1" } },
      )}
    >
      <HypertuneHydrator dehydratedState={serverDehydratedState}>
        <ClientComponent />
      </HypertuneHydrator>
    </HypertuneRootProvider>
  )
}
