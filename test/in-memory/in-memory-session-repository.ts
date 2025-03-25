import { SessionRepository } from '@domain/main/app/repositories/session-repository'
import { Session } from '@domain/main/enterprise/entities/session'

export class InMemorySessionRepository implements SessionRepository {
  public items: Session[] = []

  async findByAccountId(accountId: string): Promise<Session | null> {
    return (
      this.items.find(session => session.accountId.toString() === accountId) ||
      null
    )
  }

  async upsert(session: Session): Promise<void> {
    const index = this.items.findIndex(
      s => s.id.toString() === session.id.toString()
    )

    if (index === -1) {
      this.items.push(session)
    } else {
      this.items[index] = session
    }
  }
}
