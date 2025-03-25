import { z } from 'zod'

export const googleCallbackPayloadSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string().email(),
})

export type GoogleCallbackPayload = z.infer<typeof googleCallbackPayloadSchema>
