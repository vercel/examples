import { useQueryState } from 'nuqs'

export function useTabState() {
  const [tabId, setTabId] = useQueryState('tab', { defaultValue: 'chat' })
  return [tabId, setTabId] as const
}
