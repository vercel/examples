// temporary, remove once we support logging
import log from './log'

const DATADOME_TIMEOUT = 500
const DATADOME_URI_REGEX_EXCLUSION =
  /\.(avi|flv|mka|mkv|mov|mp4|mpeg|mpg|mp3|flac|ogg|ogm|opus|wav|webm|webp|bmp|gif|ico|jpeg|jpg|png|svg|svgz|swf|eot|otf|ttf|woff|woff2|css|less|js)$/i

export default async function datadome(
  req,
  res,
  headers?: Record<string, string>
) {
  if (DATADOME_URI_REGEX_EXCLUSION.test(req.url.pathname)) {
    await log('ignore datadome')
    return true
  }

  const requestData = {
    Key: process.env.DATADOME_SERVER_KEY,
    RequestModuleName: 'Next.js',
    ModuleVersion: '0.1',
    ServerName: 'vercel',
    /* this should be `x-real-ip` but it doesn't currently work on Edge Functions */
    IP: req.headers.get('x-forwarded-for')
      ? req.headers.get('x-forwarded-for').split(',')[0]
      : '127.0.0.1',
    Port: 0,
    TimeRequest: new Date().getTime() * 1000,
    Protocol: req.headers.get('x-forwarded-proto'),
    Method: req.method,
    ServerHostname: req.headers.get('host'),
    Request: req.url.pathname + encode(req.url.query),
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

  await log('api call data', JSON.stringify(requestData, null, 2))

  const dataDomeReq = fetch(
    'http://api-cloudflare.datadome.co/validate-request/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DataDome',
        ...headers,
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
  let dataDomeTook: number
  const dataDomeStart = Date.now()

  try {
    dataDomeRes = (await Promise.race([
      dataDomeReq,
      timeoutPromise,
    ])) as Response
    dataDomeTook = Date.now() - dataDomeStart
    log('Datadome took', dataDomeTook)
  } catch (err) {
    console.error('Datadome error', err.stack)
    return true
  }

  await log(
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
        log(
          'Bot detected. Name:',
          dataDomeRes.headers.get('x-datadome-botname'),
          '– Kind:',
          dataDomeRes.headers.get('x-datadome-botfamily')
        )
      }
      res.writeHead(
        200,
        toHeaders(req.headers, dataDomeRes.headers, 'x-datadome-headers')
      )
      res.end(await dataDomeRes.text())
      return false

    case 400:
      // Something is wrong with our authentication
      await log('DataDome returned 400', dataDomeRes.statusText)
      return false

    case 200:
      res.setHeaders(
        toHeaders(req.headers, dataDomeRes.headers, 'x-datadome-headers')
      )
  }

  return dataDomeTook
}

function encode(query) {
  let e = ''
  for (const k in query) {
    const v = query[k]
    e += `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
  }
  return e
}

function toHeaders(reqHeaders, dataDomeResHeaders, listKey) {
  const ret = {}
  const list = dataDomeResHeaders.get(listKey)
  for (const header of list.split(' ')) {
    const value = dataDomeResHeaders.get(header)
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
function getHeadersList(req) {
  return [...req.headers.keys()].join(',')
}

// taken from DataDome-Cloudflare-1.7.0
function getAuthorizationLength(req) {
  const authorization = req.headers.get('authorization')
  return authorization === null ? null : authorization.length
}

// taken from DataDome-Cloudflare-1.7.0
function stringify(obj) {
  const formatter = (key, value) => {
    return value === null
      ? encodeURIComponent(key)
      : encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }
  return obj
    ? Object.keys(obj)
        .map((key) => {
          const value = obj[key]
          if (value === undefined) {
            return ''
          }
          return formatter(key, value)
        })
        .filter((x) => x.length > 0)
        .join('&')
    : ''
}

// inspired in DataDome-Cloudflare-1.7.0
function getCookiesLength(cookies) {
  let cookiesLength = 0
  for (const k in cookies) {
    cookiesLength += cookies[k].length
  }
  return cookiesLength
}
