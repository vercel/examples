import type { EdgeRequest, EdgeResponse } from 'next'
import datadome from '@lib/datadome'

export async function middleware(req: EdgeRequest, res: EdgeResponse, next) {
  if (!(await datadome(req, res))) return
  next()
}
