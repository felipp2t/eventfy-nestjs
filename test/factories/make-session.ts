import { Session, SessionProps } from '@domain/main/enterprise/entities/session'
import { faker } from '@faker-js/faker'
import { PrismaSessionMapper } from '@infra/database/prisma/mappers/prisma-session-mapper'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { getFutureDate } from 'src/core/utils/get-future-date'

type MakeSession = Partial<SessionProps> & { expiresIn?: number }

export const makeSession = (
  { expiresIn, ...override }: MakeSession = {},
  id?: UniqueEntityID
) => {
  return Session.create(
    {
      accountId: new UniqueEntityID(),
      refreshToken: faker.internet.jwt({
        payload: {
          sub: override.accountId?.toString(),
          exp: expiresIn || getFutureDate(7),
        },
      }),
      ...override,
    },
    id
  )
}

@Injectable()
export class SessionFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaSession(data: MakeSession): Promise<SessionProps> {
    const account = makeSession(data)

    await this.prisma.session.create({
      data: PrismaSessionMapper.toPrisma(account),
    })

    return account
  }
}