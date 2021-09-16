import type { EdgeRequest, EdgeResponse } from 'next'

export default function (req: EdgeRequest, res: EdgeResponse) {
  // check if there is a cookie called "bucket"
  let bucket = req.cookies.bucket

  // if the "bucket" cookie doesn't exist
  if (!bucket) {
    // randomly assign values "a" or "b" to the bucket variable
    bucket = Math.random() >= 0.5 ? 'a' : 'b'

    // set "bucket" cookie to the bucket variable
    res.cookie('bucket', bucket)
  }

  // rewrite content according to the value of the bucket variable
  res.rewrite(`/home/${bucket}`)
}
