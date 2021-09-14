import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'

export default function (req: EdgeRequest, res: EdgeResponse, next: EdgeNext) {
  const auth = req.headers.get('authorization')
  if (auth != null) {
    const [user, pwd] = atob(auth.split(' ')[1]).split(':')
    if (user === '4dmin' && pwd === 'testpwd123') {
      return next()
    }
  }
  res.statusCode = 401
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' })
  res.end('Auth required')
}
