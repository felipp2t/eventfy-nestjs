import { Account, AccountProps } from '@domain/main/enterprise/entities/account'
import { faker } from '@faker-js/faker'
import { PrismaAccountMapper } from '@infra/database/prisma/mappers/prisma-account-mapper'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export const makeAccount = (
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID
) => {
  return Account.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      provider: AUTH_METHOD.EMAIL,
      ...override,
    },
    id
  )
}

@Injectable()
export class AccountFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAccount(data: Partial<AccountProps> = {}): Promise<Account> {
    const account = makeAccount(data)

    await this.prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    })

    return account
  }
}
