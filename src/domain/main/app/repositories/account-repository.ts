import { Account } from '@domain/main/enterprise/entities/account'

export interface UpdatePasswordParams {
  accountId: string
  password: string
}

export abstract class AccountRepository {
  abstract findById: (id: string) => Promise<Account | null>
  abstract findByEmail: (email: string) => Promise<Account | null>
  abstract create: (account: Account) => Promise<void>
  abstract updatePassword: ({
    accountId,
    password,
  }: UpdatePasswordParams) => Promise<void>
}
