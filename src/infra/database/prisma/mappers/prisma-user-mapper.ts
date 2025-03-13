import { User } from '@domain/main/enterprise/entities/user'
import { User as PrismaUser } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id.toString(),
      email: user.email,
      password: user.password || null,
      createdAt: user.createdAt,
    }
  }
}
