import { SessionRepository } from '@domain/main/app/repositories/session-repository'
import { Session } from '@domain/main/enterprise/entities/session'

export class InMemorySessionRepository implements SessionRepository {
  public items: Session[] = []

  async findByRefreshToken(refreshToken: string) {
    return (
      this.items.find(session => session.refreshToken === refreshToken) || null
    )
  }

  async create(session: Session) {
    this.items.push(session)
  }

  async remove({ userId, accountId }: { userId: string; accountId: string }) {
    this.items = this.items.filter(
      session =>
        session.userId.toString() !== userId &&
        session.accountId.toString() !== accountId
    )
  }

  async upsert(session: Session) {
    const index = this.items.findIndex(
      s => s.userId.toString() === session.userId.toString()
    )

    if (index === -1) this.items.push(session)
    else this.items[index] = session
  }
}