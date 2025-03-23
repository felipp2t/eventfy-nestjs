import { Account } from '@domain/main/enterprise/entities/account'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

export interface FindByProviderAndId {
  providerId: string
  provider: AUTH_METHOD.GOOGLE | AUTH_METHOD.GITHUB
}

export interface FindByUserIdAndProvider {
  userId: string
  provider: AUTH_METHOD.EMAIL
}

export abstract class AccountRepository {
  abstract findById: (id: string) => Promise<Account | null>
  abstract findByUserId: (userId: string) => Promise<Account[] | null>
  abstract findByProviderAndId: ({
    provider,
    providerId,
  }: FindByProviderAndId) => Promise<Account | null>
  abstract findByUserIdAndProvider: ({
    userId,
    provider,
  }: FindByUserIdAndProvider) => Promise<Account | null>
  abstract create: (account: Account) => Promise<void>
}
