import { Account } from '@domain/main/enterprise/entities/account'
import { Account as PrismaAccount } from '@prisma/client'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create(
      {
        name: raw.name,
        userId: new UniqueEntityID(raw.userId),
        provider: raw.provider as AUTH_METHOD,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(account: Account): PrismaAccount {
    return {
      id: account.id.toString(),
      name: account.name,
      provider: account.provider,
      userId: account.userId.toString(),
      createdAt: account.createdAt,
      providerId: account.providerId ?? null,
    }
  }
}