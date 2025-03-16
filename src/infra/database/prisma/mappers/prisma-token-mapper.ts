import { AuthToken } from '@domain/main/enterprise/entities/auth-token'
import { AuthToken as PrismaAuthProvider } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaAuthTokenMapper {
  static toDomain(token: PrismaAuthProvider): AuthToken {
    return AuthToken.create(
      {
        providerId: new UniqueEntityID(token.providerId),
        userId: new UniqueEntityID(token.userId),
        refreshToken: token.refreshToken,
        createdAt: token.createdAt,
      },
      new UniqueEntityID(token.id)
    )
  }

  static toPrisma(token: AuthToken): PrismaAuthProvider {
    return {
      providerId: token.providerId.toString(),
      refreshToken: token.refreshToken,
      userId: token.userId.toString(),
      createdAt: token.createdAt,
      id: token.id.toString(),
    }
  }
}
