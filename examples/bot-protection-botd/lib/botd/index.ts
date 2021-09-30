import type { EdgeRequest, EdgeResponse } from 'next'
import {
  BOTD_DEFAULT_URL,
  BOTD_EDGE_PATH,
  COOKIE_NAME,
  EDGE_RESULT_HEADERS,
  REQUEST_STATUS_HEADER,
  REQUEST_ID_HEADER,
  STATUS,
  TIMEOUT,
  ERROR_DESCRIPTION_HEADER,
  RESULT_HEADERS,
  BOTD_RESULT_PATH,
  AUTO_TOOL_PROB_HEADER,
  SEARCH_BOT_PROB_HEADER,
  VM_PROB_HEADER,
  BROWSER_SPOOFING_PROB_HEADER,
} from './constants'

const STATIC_REGEX_EXCLUSION =
  /\.(avi|flv|mka|mkv|mov|mp4|mpeg|mpg|mp3|flac|ogg|ogm|opus|wav|webm|webp|bmp|gif|ico|jpeg|jpg|png|svg|svgz|swf|eot|otf|ttf|woff|woff2|css|less|js)$/i

const defaultOptions = {
  useRequestId: true,
}

export async function botdEdge(
  req: EdgeRequest,
  res: EdgeResponse,
  options: { useRequestId?: boolean } = defaultOptions
) {
  const token = getToken()
  if (!token) return false

  const pathname = req.url?.pathname!

  if (STATIC_REGEX_EXCLUSION.test(pathname)) {
    if (!isFavicon(req)) {
      return false
    }
  }

  const body = {
    headers: getHeadersDict(req.headers),
    path: pathname,
    previous_request_id:
      (options.useRequestId && req.cookies[COOKIE_NAME]) || '',
    timestamp: Date.now(),
  }
  // `?header` is used to always get results in headers
  const botdReq = fetch(`${BOTD_DEFAULT_URL}${BOTD_EDGE_PATH}?header`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth-Token': token,
    },
    body: JSON.stringify(body),
  })
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Botd timeout'))
    }, TIMEOUT)
  })

  let botdRes: Response
  const botdStart = Date.now()

  try {
    botdRes = (await Promise.race([botdReq, timeoutPromise])) as Response
    // We're sending the latency for demo purposes,
    // this is not something you need to do
    res.setHeader('x-botd-latency', `${Date.now() - botdStart}`)
  } catch (err) {
    console.error('Botd error', err)
    return false
  }

  const status = botdRes.headers.get(REQUEST_STATUS_HEADER)

  console.log(
    'botd debug',
    botdRes.status,
    await botdRes.text(),
    body,
    JSON.stringify(Object.fromEntries(botdRes.headers), null, 2)
  )

  switch (status) {
    case STATUS.ERROR:
      const error = botdRes.headers.get(ERROR_DESCRIPTION_HEADER)

      res.headers.set(REQUEST_STATUS_HEADER, status)
      res.headers.set(ERROR_DESCRIPTION_HEADER, error ?? '')

      console.error('Botd failed to process request with:', error)
      return false

    case STATUS.PROCESSED:
      for (const name of EDGE_RESULT_HEADERS) {
        const value = botdRes.headers.get(name)
        if (value) {
          res.headers.set(name, value)
        }
      }

      const requestId = botdRes.headers.get(REQUEST_ID_HEADER)

      res.cookie(COOKIE_NAME, requestId!)

      // For edge detection not all of these headers return something
      const botProb = Number(botdRes.headers.get(AUTO_TOOL_PROB_HEADER))
      const searchBotProb = Number(botdRes.headers.get(SEARCH_BOT_PROB_HEADER))
      const vmProb = Number(botdRes.headers.get(VM_PROB_HEADER))
      const browserSpoofingProb = Number(
        botdRes.headers.get(BROWSER_SPOOFING_PROB_HEADER)
      )

      if (
        botProb > 0 ||
        searchBotProb > 0 ||
        vmProb > 0 ||
        browserSpoofingProb > 0
      ) {
        return true
      }

      return false

    default:
      console.error(`Unknown status from botd: ${status}`)
      return false
  }
}

export async function botd(req: EdgeRequest, res: EdgeResponse) {
  const token = getToken()
  if (!token) return false

  const pathname = req.url?.pathname!

  if (STATIC_REGEX_EXCLUSION.test(pathname)) {
    if (isFavicon(req)) {
      return botdEdge(req, res)
    }
    return false
  }

  const requestId = req.headers.get(REQUEST_ID_HEADER)
  // `?header` is used to always get results in headers
  const botdReq = fetch(
    `${BOTD_DEFAULT_URL}${BOTD_RESULT_PATH}?header&token=${token}&id=${requestId}`
  )
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Botd timeout'))
    }, TIMEOUT)
  })

  let botdRes: Response
  const botdStart = Date.now()

  try {
    botdRes = (await Promise.race([botdReq, timeoutPromise])) as Response
    // We're sending the latency for demo purposes,
    // this is not something you need to do
    res.setHeader('x-botd-latency', `${Date.now() - botdStart}`)
  } catch (err) {
    console.error('Botd error', err)
    return false
  }

  const status = botdRes.headers.get(REQUEST_STATUS_HEADER)

  console.log(
    'botd debug',
    botdRes.status,
    await botdRes.text(),
    JSON.stringify(Object.fromEntries(botdRes.headers), null, 2)
  )

  switch (status) {
    case STATUS.ERROR:
      const error = botdRes.headers.get(ERROR_DESCRIPTION_HEADER)

      res.headers.set(REQUEST_STATUS_HEADER, status)
      res.headers.set(ERROR_DESCRIPTION_HEADER, error ?? '')

      console.error('Botd failed to process request with:', error)
      return false

    case STATUS.PROCESSED:
      for (const name of RESULT_HEADERS) {
        const value = botdRes.headers.get(name)
        if (value) {
          res.headers.set(name, value)
        }
      }
      return false

    default:
      console.error(`Unknown status from botd: ${status}`)
      return false
  }
}

function getToken() {
  const token = process.env.NEXT_PUBLIC_BOTD_API_TOKEN

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('NEXT_PUBLIC_BOTD_API_TOKEN is not defined')
    }
    console.error(
      'Skipping Botd because the env NEXT_PUBLIC_BOTD_API_TOKEN is missing'
    )
  }

  return token
}

function getHeadersDict(headers: Headers) {
  const headersDict: Record<string, string[]> = {}
  for (const [key, value] of headers) {
    headersDict[key] = [value]
  }
  return headersDict
}

export function isFavicon(req: EdgeRequest) {
  const pathname = req.url?.pathname!
  return pathname.endsWith('.ico') && pathname.indexOf('fav') > -1
}
