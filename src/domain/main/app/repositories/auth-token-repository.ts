import { AuthToken } from '@domain/main/enterprise/entities/auth-token'

interface Remove {
  userId: string
  providerId: string
}

export abstract class AuthTokenRepository {
  abstract findByRefreshToken: (
    refreshToken: string
  ) => Promise<AuthToken | null>
  abstract create: (token: AuthToken) => Promise<void>
  abstract remove({ userId, providerId }: Remove): Promise<void>
  abstract upsert(token: AuthToken): Promise<void>
}
