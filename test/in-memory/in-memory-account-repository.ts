import {
  AccountRepository,
  UpdatePasswordParams,
} from '@domain/main/app/repositories/account-repository'
import { Account } from '@domain/main/enterprise/entities/account'
import { Password } from '@domain/main/enterprise/entities/value-objects/password'

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = []

  async findById(id: string): Promise<Account | null> {
    return this.items.find(account => account.id.toString() === id) ?? null
  }
  async findByEmail(email: string): Promise<Account | null> {
    return this.items.find(account => account.email === email) ?? null
  }
  async updatePassword({
    accountId,
    password,
  }: UpdatePasswordParams): Promise<void> {
    const account = this.items.find(account => account.id.toString() === accountId)
    account!.password = await Password.create(password)
  }

  async create(account: Account): Promise<void> {
    this.items.push(account)
  }
}
