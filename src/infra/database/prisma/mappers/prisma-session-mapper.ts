import { Session } from '@domain/main/enterprise/entities/session'
import { Session as PrismaSession } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession): Session {
    return Session.create(
      {
        accountId: new UniqueEntityID(raw.accountId),
        refreshToken: raw.refreshToken,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(session: Session): PrismaSession {
    return {
      id: session.id.toString(),
      accountId: session.accountId.toString(),
      refreshToken: session.refreshToken,
      createdAt: session.createdAt,
    }
  }
}
