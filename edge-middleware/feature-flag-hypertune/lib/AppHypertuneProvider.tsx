'use client'

import { DehydratedState, RootArgs } from '../generated/hypertune'
import { HypertuneProvider } from '../generated/hypertune.react'

export default function AppHypertuneProvider({
  serverDehydratedState,
  serverRootArgs,
  children,
}: {
  serverDehydratedState: DehydratedState | null
  serverRootArgs: RootArgs
  children: React.ReactNode
}) {
  return (
    <HypertuneProvider
      createSourceOptions={{
        token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
      }}
      dehydratedState={serverDehydratedState}
      rootArgs={{
        ...serverRootArgs,
        // Set real values for browser-only args, e.g.
        // context: {
        //   ...serverRootArgs.context,
        //   browserOnlyId: "1",
        // },
      }}
    >
      {children}
    </HypertuneProvider>
  )
}
