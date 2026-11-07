export const UID_COOKIE = 'uid'
export const EXPERIMENT_FLAG_KEY = 'ab-testing-example'
export const BUCKETS = ['control', 'experiment'] as const
export type Bucket = (typeof BUCKETS)[number]
export const FALLBACK_BUCKET: Bucket = 'control'
