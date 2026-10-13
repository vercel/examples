import { z } from 'zod'

export const getInstanceInput = z.object({}).optional()

export type GetInstanceInput = z.infer<typeof getInstanceInput>
