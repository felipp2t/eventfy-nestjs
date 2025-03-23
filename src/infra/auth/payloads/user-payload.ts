import { z } from 'zod'

export const tokenPayloadSchema = z.object({
  sub: z.string(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>
