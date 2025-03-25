import { Session } from '@domain/main/enterprise/entities/session'

export abstract class SessionRepository {
  abstract findByAccountId: (accountId: string) => Promise<Session | null>
  abstract upsert(session: Session): Promise<void>
}
