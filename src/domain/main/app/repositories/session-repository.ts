import { Session } from '@domain/main/enterprise/entities/session'

export abstract class SessionRepository {
  abstract findByRefreshToken: (refreshToken: string) => Promise<Session | null>
  abstract create: (session: Session) => Promise<void>
  abstract remove(accountId: string): Promise<void>
  abstract upsert(session: Session): Promise<void>
}
