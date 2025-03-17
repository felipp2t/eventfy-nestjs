import { AccountRepository } from '@domain/main/app/repositories/account-repository'
import { Account } from '@domain/main/enterprise/entities/account'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { PrismaAccountMapper } from '../mappers/prisma-account-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    })

    if (!account) return null

    return PrismaAccountMapper.toDomain(account)
  }

  async findByUserId(userId: string): Promise<Account[] | null> {
    const account = await this.prisma.account.findMany({
      where: { userId },
    })

    if (!account) return null

    return account.map(PrismaAccountMapper.toDomain)
  }

  async findByProvider(provider: AUTH_METHOD): Promise<Account[] | null> {
    const user = await this.prisma.account.findMany({
      where: { name: provider },
    })

    if (!user) return null

    return user.map(u => PrismaAccountMapper.toDomain(u))
  }

  async create(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account)

    await this.prisma.account.create({ data })
  }
}
