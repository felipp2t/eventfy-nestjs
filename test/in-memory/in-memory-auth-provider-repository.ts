import { AuthProviderRepository } from '@domain/main/app/repositories/auth-provider-repository'
import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

export class InMemoryAuthProviderRepository implements AuthProviderRepository {
  public items: AuthProvider[] = []

  async findById(id: string) {
    return this.items.find(provider => provider.id.toString() === id) || null
  }

  async findByUserId(userId: string) {
    return this.items.filter(provider => provider.userId.toString() === userId)
  }

  async findByProvider(provider: AUTH_METHOD) {
    return this.items.filter(p => p.provider === provider) || null
  }

  async create(provider: AuthProvider) {
    this.items.push(provider)
  }
}
