import { Account } from '@domain/main/enterprise/entities/account'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

export abstract class AccountRepository {
  abstract findById: (id: string) => Promise<Account | null>
  abstract findByUserId: (userId: string) => Promise<Account[] | null>
  abstract findByProvider: (provider: AUTH_METHOD) => Promise<Account[] | null>
  abstract create: (account: Account) => Promise<void>
}
