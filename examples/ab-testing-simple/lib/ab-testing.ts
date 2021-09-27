import type { EdgeRequest, EdgeResponse } from 'next'

export function setBucket(
  req: EdgeRequest,
  res: EdgeResponse,
  buckets: readonly string[],
  cookie: string = 'bucket'
) {
  let bucket = req.cookies[cookie]

  if (!bucket) {
    // Get a random number between 0 and 1
    let n = cryptoRandom() * 100
    // Get the percentage of each bucket
    let percentage = 100 / buckets.length

    // Loop through the buckets and see if the random number falls
    // within the range of the bucket
    bucket =
      buckets.find(() => {
        n -= percentage
        return n <= 0
      }) ?? buckets[0]

    // set bucket cookie
    res.cookie(cookie, bucket)
  }

  return bucket
}

function cryptoRandom() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)
}
