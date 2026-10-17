export function isRemoteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

export function imageSrc(key: string) {
  return isRemoteUrl(key) ? key : `/api/file?key=${encodeURIComponent(key)}`
}

export function isUserObjectKey(key: string, userId: string) {
  return key.startsWith(`posts/${userId}/`) && !key.includes('..')
}
