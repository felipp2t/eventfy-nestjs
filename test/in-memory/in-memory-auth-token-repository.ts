import { AuthTokenRepository } from '@domain/main/app/repositories/auth-token-repository'
import { AuthToken } from '@domain/main/enterprise/entities/auth-token'

export class InMemoryAuthTokenRepository implements AuthTokenRepository {
  public items: AuthToken[] = []

  async findByRefreshToken(refreshToken: string) {
    return this.items.find(token => token.refreshToken === refreshToken) || null
  }

  async create(token: AuthToken) {
    this.items.push(token)
  }

  async deleteByUserId(userId: string) {
    this.items = this.items.filter(token => token.userId.toString() !== userId)
  }
}
