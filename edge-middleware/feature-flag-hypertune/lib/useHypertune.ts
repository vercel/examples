import React, { useEffect, useMemo } from 'react'
import hypertune from './hypertune'

export default function useHypertune() {
  const [isInitialized, setIsInitialized] = React.useState<boolean>(
    hypertune.isInitialized(),
  )

  useEffect(() => {
    hypertune.waitForInitialization().then(() => {
      setIsInitialized(true)
    })
  }, [])

  return useMemo(
    () =>
      hypertune.root({
        context: {
          user: { id: 'test_id', name: 'Test', email: 'test@test.com' },
        },
      }),
    [],
  )
}
