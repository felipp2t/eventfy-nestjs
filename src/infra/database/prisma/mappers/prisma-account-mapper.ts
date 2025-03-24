import { Account } from '@domain/main/enterprise/entities/account'
import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { Account as PrismaAccount } from '@prisma/client'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create(
      {
        email: raw.email,
        password: raw.password ? Password.fromHash(raw.password) : null,
        name: raw.name,
        provider: raw.provider as AUTH_METHOD,
        providerId: raw.providerId ?? null,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(account: Account): PrismaAccount {
    return {
      id: account.id.toString(),
      email: account.email,
      password: account.password?.getHash() || null,
      name: account.name,
      provider: account.provider,
      providerId: account.providerId ?? null,
      createdAt: account.createdAt,
    }
  }
}
