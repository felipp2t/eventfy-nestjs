import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { AuthProvider as PrismaAuthProvider } from '@prisma/client'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaAuthProviderMapper {
  static toDomain(raw: PrismaAuthProvider): AuthProvider {
    return AuthProvider.create(
      {
        name: raw.name,
        userId: new UniqueEntityID(raw.userId),
        provider: raw.provider as AUTH_METHOD,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(user: AuthProvider): PrismaAuthProvider {
    return {
      id: user.id.toString(),
      name: user.name,
      provider: user.provider,
      userId: user.userId.toString(),
      createdAt: user.createdAt,
    }
  }
}
