import { Session } from '@domain/main/enterprise/entities/session'

interface Remove {
  userId: string
  accountId: string
}

export abstract class SessionRepository {
  abstract findByRefreshToken: (
    refreshToken: string
  ) => Promise<Session | null>
  abstract create: (session: Session) => Promise<void>
  abstract remove({ userId, accountId }: Remove): Promise<void>
  abstract upsert(session: Session): Promise<void>
}
