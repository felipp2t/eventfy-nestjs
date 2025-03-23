import {
  AccountRepository,
  FindByProviderAndId,
  FindByUserIdAndProvider,
} from '@domain/main/app/repositories/account-repository'
import { Account } from '@domain/main/enterprise/entities/account'

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = []

  async findById(id: string): Promise<Account | null> {
    return this.items.find(account => account.id.toString() === id) || null
  }

  async findByUserId(userId: string): Promise<Account[] | null> {
    return this.items.filter(account => account.userId.toString() === userId)
  }

  async findByProviderAndId({
    provider,
    providerId,
  }: FindByProviderAndId): Promise<Account | null> {
    return (
      this.items.find(
        account =>
          account.provider === provider && account.providerId === providerId
      ) || null
    )
  }

  async findByUserIdAndProvider({
    userId,
    provider,
  }: FindByUserIdAndProvider): Promise<Account | null> {
    return (
      this.items.find(
        account =>
          account.userId.toString() === userId && account.provider === provider
      ) || null
    )
  }

  async create(account: Account): Promise<void> {
    this.items.push(account)
  }
}