export function decodeJwt(token: string) {
  const parts = token.split('.')
  const payload = JSON.parse(atob(parts[1]))
  return payload
}
