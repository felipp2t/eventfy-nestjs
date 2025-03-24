import { SessionRepository } from '@domain/main/app/repositories/session-repository'
import { Session } from '@domain/main/enterprise/entities/session'

export class InMemorySessionRepository implements SessionRepository {
  public items: Session[] = []

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return (
      this.items.find(session => session.refreshToken === refreshToken) || null
    )
  }

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }

  async remove(accountId: string): Promise<void> {
    const index = this.items.findIndex(
      session => session.accountId.toString() === accountId
    )
    this.items.splice(index, 1)
  }

  async upsert(session: Session): Promise<void> {
    const index = this.items.findIndex(
      s => s.accountId.toString() === session.accountId.toString()
    )
    
    if (index === -1) {
      this.items.push(session)
    } else {
      this.items[index] = session
    }
  }
}
