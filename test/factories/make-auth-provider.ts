import {
  AuthProvider,
  AuthProviderProps,
} from '@domain/main/enterprise/entities/auth-provider'
import { faker } from '@faker-js/faker'
import { PrismaAuthProviderMapper } from '@infra/database/prisma/mappers/prisma-provider-mapper'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export const makeAuthProvider = (
  override: Partial<AuthProviderProps> = {},
  id?: UniqueEntityID
) => {
  return AuthProvider.create(
    {
      name: faker.person.fullName(),
      provider: AUTH_METHOD.EMAIL,
      userId: new UniqueEntityID(),
      ...override,
    },
    id
  )
}

@Injectable()
export class AuthProviderFactory {
  constructor(private prisma: PrismaService) {}

  async makeAuthProvider(
    data: Partial<AuthProviderProps> = {}
  ): Promise<AuthProvider> {
    const provider = makeAuthProvider(data)

    await this.prisma.authProvider.create({
      data: PrismaAuthProviderMapper.toPrisma(provider),
    })

    return provider
  }
}
