export default function getIP(request: any) {
  const xff =
    typeof request.headers.get === 'function'
      ? request.headers.get('x-forwarded-for')
      : request.headers['x-forwarded-for']

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(',')[0]) : '127.0.0.1'
}
