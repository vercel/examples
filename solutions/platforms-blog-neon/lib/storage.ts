import 'server-only'
import { AwsClient } from 'aws4fetch'
import { requireEnv } from '@/lib/env'

// Server-only client for Neon Object Storage (S3-compatible, SigV4,
// path-style). The bucket is private, so uploads are signed and public reads
// go through short-lived presigned URLs (see `presignGet`).
const endpoint = requireEnv(
  process.env.AWS_ENDPOINT_URL_S3,
  'AWS_ENDPOINT_URL_S3'
)
const bucket = requireEnv(process.env.AWS_S3_BUCKET, 'AWS_S3_BUCKET')

const aws = new AwsClient({
  accessKeyId: requireEnv(process.env.AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID'),
  secretAccessKey: requireEnv(
    process.env.AWS_SECRET_ACCESS_KEY,
    'AWS_SECRET_ACCESS_KEY'
  ),
  region: requireEnv(process.env.AWS_REGION, 'AWS_REGION'),
  service: 's3',
})

function objectUrl(key: string) {
  return `${endpoint}/${bucket}/${encodeURI(key)}`
}

export async function putObject(
  key: string,
  body: ArrayBuffer,
  contentType: string
) {
  const res = await aws.fetch(objectUrl(key), {
    method: 'PUT',
    body,
    headers: { 'content-type': contentType },
  })
  if (!res.ok) {
    throw new Error(`upload failed: ${res.status} ${await res.text()}`)
  }
}

// Presign a GET URL so a private object can be shown in an <img> tag.
export async function presignGet(key: string, expiresInSeconds = 3600) {
  const url = new URL(objectUrl(key))
  url.searchParams.set('X-Amz-Expires', String(expiresInSeconds))
  const signed = await aws.sign(url.toString(), {
    method: 'GET',
    aws: { signQuery: true },
  })
  return signed.url
}
