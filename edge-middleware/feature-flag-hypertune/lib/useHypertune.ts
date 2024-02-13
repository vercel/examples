import React, { useEffect, useMemo } from 'react'
import hypertune from './hypertune'

export default function useHypertune() {
  // Trigger a re-render when flags are updated
  const [, setStateHash] = React.useState<string | null>(
    hypertune.getStateHash(),
  )
  useEffect(() => {
    hypertune.addUpdateListener(setStateHash)
    return () => {
      hypertune.removeUpdateListener(setStateHash)
    }
  }, [])

  // Return the Hypertune root node initialized with the current user
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
