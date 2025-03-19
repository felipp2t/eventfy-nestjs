import { Account } from '@domain/main/enterprise/entities/account'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

export interface FindByProviderId {
  providerId: string
  provider: AUTH_METHOD.GOOGLE | AUTH_METHOD.GITHUB
}

export abstract class AccountRepository {
  abstract findById: (id: string) => Promise<Account | null>
  abstract findByUserId: (userId: string) => Promise<Account[] | null>
  abstract findByProviderId: ({
    provider,
    providerId,
  }: FindByProviderId) => Promise<Account | null>
  abstract create: (account: Account) => Promise<void>
}
