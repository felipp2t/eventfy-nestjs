import { AccountRepository } from '@domain/main/app/repositories/account-repository'
import { Account } from '@domain/main/enterprise/entities/account'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = []

  async findById(id: string): Promise<Account | null> {
    return this.items.find(account => account.id.toString() === id) || null
  }

  async findByUserId(userId: string): Promise<Account[] | null> {
    return this.items.filter(account => account.userId.toString() === userId)
  }

  async findByProvider(provider: AUTH_METHOD): Promise<Account[] | null> {
    return this.items.filter(account => account.provider === provider) || null
  }

  async create(account: Account): Promise<void> {
    this.items.push(account)
  }
}
