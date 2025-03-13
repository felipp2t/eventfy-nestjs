import { AuthToken } from '@domain/main/enterprise/entities/auth-token'

export abstract class AuthTokenRepository {
  abstract findByRefreshToken: (
    refreshToken: string
  ) => Promise<AuthToken | null>
  abstract create: (token: AuthToken) => Promise<void>
  abstract deleteByUserId: (userId: string) => Promise<void>
}
