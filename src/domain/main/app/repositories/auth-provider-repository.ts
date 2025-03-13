import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

export abstract class AuthProviderRepository {
  abstract findById: (id: string) => Promise<AuthProvider | null>
  abstract findByUserId: (userId: string) => Promise<AuthProvider[] | null>
  abstract findByProvider: (
    provider: AUTH_METHOD
  ) => Promise<AuthProvider[] | null>
  abstract create: (provider: AuthProvider) => Promise<void>
}
