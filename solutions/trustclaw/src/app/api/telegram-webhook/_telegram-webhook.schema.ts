import { z } from 'zod'

const telegramUser = z.object({
  id: z.number().int(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
})

const telegramChat = z.object({
  id: z.number().int(),
  type: z.enum(['private', 'group', 'supergroup', 'channel']),
  title: z.string().optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

const telegramMessage = z.object({
  message_id: z.number().int(),
  from: telegramUser.optional(),
  date: z.number().int(),
  chat: telegramChat,
  text: z.string().optional(),
})

export const telegramUpdateInput = z.object({
  update_id: z.number().int(),
  message: telegramMessage.optional(),
})

export type TelegramUpdate = z.infer<typeof telegramUpdateInput>
