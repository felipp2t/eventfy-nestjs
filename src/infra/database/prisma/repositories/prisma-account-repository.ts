import {
  AccountRepository,
  UpdatePasswordParams,
} from '@domain/main/app/repositories/account-repository'
import { Account } from '@domain/main/enterprise/entities/account'
import { Injectable } from '@nestjs/common'
import { PrismaAccountMapper } from '../mappers/prisma-account-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    })

    return account ? PrismaAccountMapper.toDomain(account) : null
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { email },
    })

    return account ? PrismaAccountMapper.toDomain(account) : null
  }

  async create(account: Account): Promise<void> {
    await this.prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    })
  }

  async updatePassword({
    accountId,
    password,
  }: UpdatePasswordParams): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { password },
    })
  }
}
