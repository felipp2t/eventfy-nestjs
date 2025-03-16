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

  async remove({ userId, providerId }: { userId: string; providerId: string }) {
    this.items = this.items.filter(
      token =>
        token.userId.toString() !== userId &&
        token.providerId.toString() !== providerId
    )
  }

  async upsert(token: AuthToken) {
    this.items = this.items.filter(
      t =>
        t.userId.toString() !== token.userId.toString() &&
        t.providerId.toString() !== token.providerId.toString()
    )
    this.items.push(token)
  }
}
