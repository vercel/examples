import { z } from 'zod'

export const deleteInstanceInput = z.object({}).optional()

export type DeleteInstanceInput = z.infer<typeof deleteInstanceInput>
