import {
  AuthToken,
  AuthTokenProps,
} from '@domain/main/enterprise/entities/auth-token'
import { faker } from '@faker-js/faker'
import { PrismaAuthTokenMapper } from '@infra/database/prisma/mappers/prisma-token-mapper'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

type MakeAuthToken = Partial<AuthTokenProps> & {
  days?: number
}

export const makeAuthToken = (
  { days, ...override }: MakeAuthToken = {},
  id?: UniqueEntityID
) => {
  return AuthToken.create(
    {
      providerId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      refreshToken: faker.internet.jwt({
        header: {
          exp: faker.date.soon({ days }),
          sub: new UniqueEntityID(override.userId?.toString()).toString(),
        },
      }),
      ...override,
    },
    id
  )
}

@Injectable()
export class AuthTokenFactory {
  constructor(private prisma: PrismaService) {}
  async makeAuthToken(data: Partial<MakeAuthToken> = {}): Promise<AuthToken> {
    const authToken = makeAuthToken(data)

    await this.prisma.authToken.create({
      data: PrismaAuthTokenMapper.toPrisma(authToken),
    })

    return authToken
  }
}
