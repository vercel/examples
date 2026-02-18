import { KameleoonClient } from '@kameleoon/nodejs-sdk'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import clientConfiguration from './lib/kameleoon/client-configuration.json'

const KAMELEOON_USER_ID = 'kameleoon_user_id'

// Replace it with your featureKey from Kameleoon Platform
const FEATURE_KEY = 'new_home_page'

// On these paths the current middleware will be invoked
export const config = {
  matcher: ['/', '/new-home-page'],
}

export default async function middleware(req: NextRequest) {
  // Fetch user id from the cookie if available to make sure that results are sticky
  // If you have your own unique user identifier, please replace crypto.randomUUID() with it
  const visitorCode =
    req.cookies.get(KAMELEOON_USER_ID)?.value || crypto.randomUUID()

  // Create KameleoonClient instance using `clientConfiguration` downloaded at build time
  // It is fetched at build time to avoid doing a fetching at the edge.
  const kameleoonClient = new KameleoonClient({
    siteCode: process.env.KAMELEOON_SITE_CODE!,
    integrations: {
      externalClientConfiguration: JSON.parse(
        JSON.stringify(clientConfiguration)
      ),
    },
  })

  // Initialize Kameleoon client before using it's methods
  await kameleoonClient.initialize()

  // Returns a boolean indicating whether the visitor with visitorCode has featureKey active for him
  const isFeatureActive = kameleoonClient.isFeatureFlagActive(
    visitorCode,
    FEATURE_KEY
  )
  // Returns a variable for the visitor under visitorCode in the found feature flag
  const homePageVariable = kameleoonClient.getFeatureFlagVariable({
    visitorCode,
    featureKey: FEATURE_KEY,
    variableKey: 'home_page',
  })

  console.log(
    `[KAMELEOON] Feature flag with '${FEATURE_KEY}' feature key is '${
      isFeatureActive ? 'active' : 'inactive'
    }'`
  )
  console.log(
    `[KAMELEOON] Feature flag with '${FEATURE_KEY}' feature key has '${homePageVariable.value}' variable`
  )

  // Rewriting the path based on `homePageVariable` value
  // If the value is `old_version`, it returns `/` path, otherwise `/new-home-page`
  req.nextUrl.pathname =
    homePageVariable.value === 'old_version' ? '/' : '/new-home-page'
  const response = NextResponse.rewrite(req.nextUrl)

  if (!req.cookies.has(KAMELEOON_USER_ID)) {
    // Saving visitorCode in the cookie so that the decision sticks for subsequent visits
    response.cookies.set(KAMELEOON_USER_ID, visitorCode)
  }

  // Return the response
  return response
}
