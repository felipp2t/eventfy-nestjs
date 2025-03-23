import { User, UserProps } from '@domain/main/enterprise/entities/user'
import { faker } from '@faker-js/faker'
import { PrismaUserMapper } from '@infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export const makeUser = (
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) => {
  return User.create(
    {
      email: faker.internet.email(),
      ...override,
    },
    id
  )
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({ data: PrismaUserMapper.toPrisma(user) })

    return user
  }
}