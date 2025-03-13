import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { AUTH_PROVIDERS } from 'src/core/constants/auth-provider'

export abstract class AuthProviderRepository {
  abstract findById: (id: string) => Promise<AuthProvider | null>
  abstract findByUserId: (userId: string) => Promise<AuthProvider[] | null>
  abstract findByProvider: (
    provider: AUTH_PROVIDERS
  ) => Promise<AuthProvider[] | null>
  abstract create: (provider: AuthProvider) => Promise<void>
}
