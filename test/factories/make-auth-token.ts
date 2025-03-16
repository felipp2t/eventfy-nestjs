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
  expiresIn?: Date
}

export const makeAuthToken = (
  { expiresIn, ...override }: MakeAuthToken = {},
  id?: UniqueEntityID
) => {
  return AuthToken.create(
    {
      providerId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      refreshToken: faker.internet.jwt({
        header: {
          alg: 'RS256',
        },
        payload: {
          sub: override.userId?.toString(),
          exp: expiresIn || "7d",
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
  async makePrismaAuthToken(data: MakeAuthToken): Promise<AuthToken> {
    const authToken = makeAuthToken(data)

    await this.prisma.authToken.create({
      data: PrismaAuthTokenMapper.toPrisma(authToken),
    })

    return authToken
  }
}
