import { NextRequest, NextResponse } from 'next/server'

const DATADOME_TIMEOUT = parseInt(process.env.DATADOME_TIMEOUT??"300")
const DATADOME_URI_REGEX_EXCLUSION =
  /\.(avi|flv|mka|mkv|mov|mp4|mpeg|mpg|mp3|flac|ogg|ogm|opus|wav|webm|webp|bmp|gif|ico|jpeg|jpg|png|svg|svgz|swf|eot|otf|ttf|woff|woff2|css|less|js|map)$/i

export default async function datadome(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (DATADOME_URI_REGEX_EXCLUSION.test(pathname)) {
    return
  }
  let { clientId, cookiesLength } = getCookieData(req.cookies)
  const requestData = {
    Key: process.env.DATADOME_SERVER_SIDE_KEY,
    // this should be `x-real-ip` but it doesn't currently work on Edge Middleware
    // localhost won't likely be blocked by Datadome unless you use your real IP
    // IP: 'YOUR IP',
    IP: req.headers.get('x-forwarded-for')
      ? req.headers.get('x-forwarded-for')!.split(',')[0]
      : '127.0.0.1',
    RequestModuleName: 'Next.js',
    ModuleVersion: '0.2.0',
    AuthorizationLen: getAuthorizationLength(req),
    Accept: req.headers.get('accept'),
    AcceptEncoding: req.headers.get('accept-encoding'),
    AcceptLanguage: req.headers.get('accept-language'),
    AcceptCharset: req.headers.get('accept-charset'),
    CacheControl: req.headers.get('cache-control'),
    ClientID: clientId,
    Connection: req.headers.get('connection'),
    ContentType: req.headers.get('content-type'),
    CookiesLen: cookiesLength,
    From: req.headers.get('from'),
    HeadersList: getHeadersList(req),
    Host: req.headers.get('host'),
    Method: req.method,
    Origin: req.headers.get('origin'),
    Port: 0,
    Pragma: req.headers.get('pragma'),
    PostParamLen: req.headers.get('content-length'),
    Protocol: req.headers.get('x-forwarded-proto'),
    Referer: req.headers.get('referer'),
    Request: pathname + encode(Object.fromEntries(req.nextUrl.searchParams)),
    ServerHostname: req.headers.get('host'),
    ServerName: 'vercel',
    ServerRegion: 'sfo1',
    TimeRequest: new Date().getTime() * 1000,
    UserAgent: req.headers.get('user-agent'),
    Via: req.headers.get('via'),
    XForwardedForIP: req.headers.get('x-forwarded-for'),
    SecCHDeviceMemory: req.headers.get('sec-ch-device-memory'),
    SecCHUA: req.headers.get('sec-ch-ua'),
    SecCHUAArch: req.headers.get('sec-ch-ua-arch'),
    SecCHUAFullVersionList: req.headers.get('sec-ch-ua-full-version-list'),
    SecCHUAMobile: req.headers.get('sec-ch-ua-mobile'),
    SecCHUAModel: req.headers.get('sec-ch-ua-model'),
    SecCHUAPlatform: req.headers.get('sec-ch-ua-platform'),
    SecFetchDest: req.headers.get('sec-fetch-dest'),
    SecFetchMode: req.headers.get('sec-fetch-mode'),
    SecFetchSite: req.headers.get('sec-fetch-site'),
    SecFetchUser: req.headers.get('sec-fetch-user'),
    'X-Real-IP': req.headers.get('x-real-ip'),
    'X-Requested-With': req.headers.get('x-requested-with'),
  }

  const options = {
    method: 'POST',
    body: stringify(requestData),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'DataDome'
    },
  }
  if (req.headers.get('x-datadome-clientid')?.length) {
    options.headers['X-DataDome-X-Set-Cookie'] = 'true'
    requestData.ClientID = req.headers.get('x-datadome-clientid') as string
  }
  const dataDomeReq = fetch('http://api.datadome.co/validate-request/', options)

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Datadome timeout'))
    }, DATADOME_TIMEOUT)
  })

  let dataDomeRes: NextResponse
  const dataDomeStart = Date.now()

  try {
    dataDomeRes = (await Promise.race([
      dataDomeReq,
      timeoutPromise,
    ])) as NextResponse
  } catch (err: any) {
    console.error('Datadome failed with:', err.stack)
    return
  }

  console.log(
    'Datadome debug',
    dataDomeRes.status,
    JSON.stringify(Object.fromEntries(dataDomeRes.headers.entries()), null, 2)
  )

  switch (dataDomeRes.status) {
    case 400:
      // Something is wrong with our authentication
      console.log('DataDome returned 400', dataDomeRes.statusText, await dataDomeRes.text())
      return

    case 200:
    case 301:
    case 302:
    case 401:
    case 403:
      // next() returns a null body and we'll use it to indicate
      // that the request is not blocked
      let res = NextResponse.next()

      if (dataDomeRes.status !== 200) {
        // blocked!
        res = new Response(dataDomeRes.body, {status: dataDomeRes.status}) as NextResponse
        const isBot = dataDomeRes.headers.get('x-datadome-isbot')
        if (isBot) {
          console.log(
            'Bot detected. Name:',
            dataDomeRes.headers.get('x-datadome-botname'),
            '– Kind:',
            dataDomeRes.headers.get('x-datadome-ruletype')
          )
        }
      }

      // Add Datadome headers to the response
      toHeaders(req.headers, dataDomeRes.headers, 'x-datadome-headers').forEach(
        (v, k) => {
          res.headers.set(k, v)
        }
      )
      console.log(
        'Datadome response debug',
        res.status,
        JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2)
      )
      // We're sending the latency for demo purposes, this is not something you need to do
      res.headers.set('x-datadome-latency', `${Date.now() - dataDomeStart}`)

      return res
  }
}

function encode(query: Record<string, string>) {
  let e = ''
  for (const k in query) {
    const v = query[k]
    e += `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
  }
  return e
}

function toHeaders(
  reqHeaders: Headers,
  dataDomeResHeaders: Headers,
  listKey: string
) {
  const map = new Map<string, string>()
  const list = dataDomeResHeaders.get(listKey)!
  for (const header of list.split(' ')) {
    const value = dataDomeResHeaders.get(header)!
    // workaround for a bug in DataDome where the cookie domain gets set to
    // the entire public suffix (.vercel.app), which UAs refuse to set cookies for
    // e.g.: https://devcenter.heroku.com/articles/cookies-and-herokuapp-com
    if (
      header.toLowerCase() === 'set-cookie' &&
      /domain=\.vercel\.app/i.test(value)
    ) {
      map.set(
        header,
        value.replace(
          /domain=\.vercel\.app/i,
          `Domain=${reqHeaders.get('host')}`
        )
      )
    } else {
      map.set(header, value)
    }
  }
  return map
}

// taken from DataDome-Cloudflare-1.7.0
function getHeadersList(req: NextRequest) {
  return [...req.headers.keys()].join(',')
}

// taken from DataDome-Cloudflare-1.7.0
function getAuthorizationLength(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  return authorization === null ? null : authorization.length
}

// taken from DataDome-Cloudflare-1.7.0
function stringify(obj: Record<string, string | number | null | undefined>) {
  return obj
    ? Object.keys(obj)
        .map((key) => {
          const value = obj[key]
          if (value === undefined) {
            return ''
          }
          return value === null || value === undefined
            ? encodeURIComponent(key)
            : encodeURIComponent(key) + '=' + encodeURIComponent(value)
        })
        .filter((x) => x.length > 0)
        .join('&')
    : ''
}
/**
 * Returns a simple object with two properties:
 *   - The client ID from the `datadome` cookie.
 *   - The total length of the `Cookie` request header.
 * @param {NextRequest['cookies']} cookies - Incoming client request cookie header
 * @returns {{ clientId: string, cookiesLength: number }}
 */
function getCookieData(cookies: NextRequest['cookies']) {
  let clientId = ''
  let cookiesLength = 0
  for (const [, cookie] of cookies) {
    cookiesLength += cookie.value.length
    if (clientId == '' && cookie.name == 'datadome') {
      clientId = cookie.value
    }
  }
  return { clientId, cookiesLength }
}
