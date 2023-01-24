export const parseToken = (token) => {
  return JSON.parse(atob(token.split('.')[1]))
}

export const parseClaims = (claims) => {
  const now = Math.round(Date.now() / 1000)
  const issuedAt = claims.iat
  const expiresAt = claims.exp
  const totalValidForSec = expiresAt - issuedAt
  const timeToLiveInSec = Math.max(expiresAt - now, 0)
  return { issuedAt, expiresAt, totalValidForSec, timeToLiveInSec, now }
}
