import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cryptoRandom } from './utils/helper'
import { ParameterValueType } from 'firebase-admin/lib/remote-config/remote-config-api'

interface RemoteConfigData {
  name: string
  parameters: {
    defaultValue: {
      value: string
    }
    conditionalValues?: Record<string, { value?: string } | undefined>
    description?: string
    valueType?: ParameterValueType | string
  }
}

interface Condition {
  weight: number
  value?: string
}

export const config = {
  matcher: '/about/:path*',
}

export async function middleware(request: NextRequest) {
  try {
    const remoteConfig = await getRemoteConfig(request, 'about_variant')

    if (!remoteConfig) return

    const { name, parameters } = remoteConfig

    // Set custom cookieValue
    const cookieKey = `firebase-remote-config.${name}`

    let cookieValue = request.cookies.get(cookieKey)?.value

    // Check if it is new visitor
    if (!cookieValue) cookieValue = getVariantByRandom(parameters)

    // Set route to the variant page
    if (cookieValue !== 'A') request.nextUrl.pathname = `/about/${cookieValue}`

    if (cookieValue) {
      // Redirect URL
      const response = NextResponse.rewrite(request.nextUrl)
      // Set custom cookie value
      response.cookies.set(cookieKey, cookieValue ? cookieValue : 'A')
      // Set custom header if needed
      response.headers.set('x-about-variant', JSON.stringify(cookieValue))

      return response
    }

    return
  } catch (error) {
    console.log(error)
  }
}

const getRemoteConfig = async (request: NextRequest, configName: string) => {
  return import('./utils/scripts/pre-build/rc-prefetched-data.json').then(
    async ({ default: prefetchedData }) => {
      let data = undefined

      // If the json file is empty
      if (!prefetchedData || prefetchedData.length === 0) {
        data = await (
          await fetch(`${request.nextUrl.origin}/api/fetchRemoteConfig`)
        ).json()
        console.log('Fetching Firebase Remote Config')
      }

      data = prefetchedData.find(
        ({ name }: RemoteConfigData) => name === configName
      )

      return data
    }
  )
}

const getVariantByRandom = (
  parameters: RemoteConfigData['parameters']
): string => {
  let defaultValue = parameters.defaultValue

  let conditionalValues = parameters.conditionalValues

  let conditions: Array<Condition> = conditionalValues
    ? Object.entries(conditionalValues).map((item) => {
        // Check if the value is undefined
        if (item[1] === undefined) return { weight: 0, value: undefined }
        const [name, { value }] = item
        const res = {
          weight: parseInt(name.split('%')[0]),
          value: value,
        }
        return res
      })
    : []

  // Rolling dice
  let n = cryptoRandom() * 100
  let cookieValue = defaultValue.value

  conditions.forEach(({ weight, value }: Condition) => {
    if (n <= 0) cookieValue = defaultValue?.value

    if (n < weight) {
      if (value) cookieValue = value
    } else {
      n -= weight
    }
  })

  return cookieValue
}
