// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

const DATADOME_TIMEOUT = 500
const DATADOME_URI_REGEX_EXCLUSION =
  /\.(avi|flv|mka|mkv|mov|mp4|mpeg|mpg|mp3|flac|ogg|ogm|opus|wav|webm|webp|bmp|gif|ico|jpeg|jpg|png|svg|svgz|swf|eot|otf|ttf|woff|woff2|css|less|js)$/i

export default async function datadome(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (DATADOME_URI_REGEX_EXCLUSION.test(pathname)) {
    console.log('ignore datadome')
    return
  }

  const requestData = {
    Key: process.env.DATADOME_SERVER_KEY,
    RequestModuleName: 'Next.js',
    ModuleVersion: '0.1',
    ServerName: 'vercel',
    /* this should be `x-real-ip` but it doesn't currently work on Edge Functions */
    IP: req.headers.get('x-forwarded-for')
      ? req.headers.get('x-forwarded-for')!.split(',')[0]
      : '127.0.0.1',
    Port: 0,
    TimeRequest: new Date().getTime() * 1000,
    Protocol: req.headers.get('x-forwarded-proto'),
    Method: req.method,
    ServerHostname: req.headers.get('host'),
    Request: pathname + encode(Object.fromEntries(req.nextUrl.searchParams)),
    HeadersList: getHeadersList(req),
    Host: req.headers.get('host'),
    UserAgent: req.headers.get('user-agent'),
    Referer: req.headers.get('referer'),
    Accept: req.headers.get('accept'),
    AcceptEncoding: req.headers.get('accept-encoding'),
    AcceptLanguage: req.headers.get('accept-language'),
    AcceptCharset: req.headers.get('accept-charset'),
    Origin: req.headers.get('origin'),
    XForwaredForIP: req.headers.get('x-forwarded-for'),
    Connection: req.headers.get('connection'),
    Pragma: req.headers.get('pragma'),
    CacheControl: req.headers.get('cache-control'),
    ContentType: req.headers.get('content-type'),
    From: req.headers.get('from'),
    Via: req.headers.get('via'),
    CookiesLen: getCookiesLength(req.cookies),
    AuthorizationLen: getAuthorizationLength(req),
    PostParamLen: req.headers.get('content-length'),
    ClientID: req.cookies.datadome,
    ServerRegion: 'sfo1',
  }
  const dataDomeReq = fetch(
    'http://api-cloudflare.datadome.co/validate-request/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DataDome',
      },
      body: stringify(requestData),
    }
  )

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Datadome timeout'))
    }, DATADOME_TIMEOUT)
  })

  let dataDomeRes: Response
  const dataDomeStart = Date.now()

  try {
    dataDomeRes = (await Promise.race([
      dataDomeReq,
      timeoutPromise,
    ])) as Response
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
    case 301:
    case 302:
    case 401:
    case 403:
      // blocked!
      // in the future we can return the bot kind, bot name, etc.
      const isBot = dataDomeRes.headers.get('x-datadome-isbot')
      if (isBot) {
        console.log(
          'Bot detected. Name:',
          dataDomeRes.headers.get('x-datadome-botname'),
          '– Kind:',
          dataDomeRes.headers.get('x-datadome-botfamily')
        )
      }

      // Once `pipeTo` is available we could stream to the response instead
      return new NextResponse(await dataDomeRes.text(), {
        headers: Object.assign(
          toHeaders(req.headers, dataDomeRes.headers, 'x-datadome-headers'),
          // We're sending the latency for demo purposes, this is not something you need to do
          { 'x-datadome-latency': `${Date.now() - dataDomeStart}` }
        ),
      })

    case 400:
      // Something is wrong with our authentication
      console.log('DataDome returned 400', dataDomeRes.statusText)
      return

    case 200: {
      // next() returns a null body and we'll use it to indicate
      // that the request is not blocked
      const res = NextResponse.next()

      // Add Datadome headers to the response
      Object.entries(
        toHeaders(req.headers, dataDomeRes.headers, 'x-datadome-headers')
      ).forEach(([k, v]) => {
        res.headers.set(k, v)
      })

      // We're sending the latency for demo purposes, this is not something you need to do
      res.headers.set('x-datadome-latency', `${Date.now() - dataDomeStart}`)

      return res
    }
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
  const ret: Record<string, string> = {}
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
      ret[header] = value.replace(
        /domain=\.vercel\.app/i,
        `Domain=${reqHeaders.get('host')}`
      )
    } else {
      ret[header] = value
    }
  }
  return ret
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

// inspired in DataDome-Cloudflare-1.7.0
function getCookiesLength(cookies: Record<string, string>) {
  let cookiesLength = 0
  for (const k in cookies) {
    cookiesLength += cookies[k].length
  }
  return cookiesLength
}
