import z from 'zod/v3'

export const dataPartSchema = z.object({
  'create-sandbox': z.object({
    sandboxId: z.string().optional(),
    status: z.enum(['loading', 'done']),
  }),
  'generating-files': z.object({
    paths: z.array(z.string()),
    status: z.enum(['generating', 'uploading', 'uploaded', 'done']),
  }),
  'run-command': z.object({
    command: z.string(),
    args: z.array(z.string()),
    status: z.enum(['loading', 'done']),
    commandId: z.string().optional(),
    sandboxId: z.string(),
  }),
  'wait-command': z.object({
    sandboxId: z.string(),
    commandId: z.string(),
    command: z.string(),
    args: z.array(z.string()),
    exitCode: z.number().optional(),
    status: z.enum(['loading', 'done']),
  }),
  'get-sandbox-url': z.object({
    url: z.string().optional(),
    status: z.enum(['loading', 'done']),
  }),
})

export type DataPart = z.infer<typeof dataPartSchema>
