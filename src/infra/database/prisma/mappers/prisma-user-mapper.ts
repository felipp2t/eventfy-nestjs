
import { User } from '@domain/main/enterprise/entities/user'
import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { User as PrismaUser } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaUserMapper {
  static async toDomain(raw: PrismaUser): Promise<User> {
    return User.create(
      {
        email: raw.email,
        password: raw.password ? Password.fromHash(raw.password) : null,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id.toString(),
      email: user.email,
      password: user.password?.getHash() || null,
      createdAt: user.createdAt,
    }
  }
}
