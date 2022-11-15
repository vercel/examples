import { useEffect } from 'react'
import { useRouter } from 'next/router'
import posthog, { PostHog, PostHogConfig } from 'posthog-js'

let POSTHOG_INSTANCE: PostHog

export const usePostHog = (
  apiKey: string,
  config?: Partial<PostHogConfig>,
  name?: string
): void => {
  const router = useRouter()

  if (!config) {
    throw new Error('The `config` argument is required.')
  }
  if (config.loaded) {
    // override the existing loaded function so we can store a reference
    // to the PostHog instance
    const oldLoaded = config.loaded
    config.loaded = (posthog: PostHog) => {
      setPostHogInstance(posthog)
      oldLoaded(POSTHOG_INSTANCE)
    }
  } else {
    config.loaded = setPostHogInstance
  }

  useEffect(() => {
    posthog.init(apiKey, config, name)

    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events, apiKey, name])
}

const setPostHogInstance = (posthog: PostHog) => {
  POSTHOG_INSTANCE = posthog
}

export const getPostHogInstance = (): PostHog => POSTHOG_INSTANCE
