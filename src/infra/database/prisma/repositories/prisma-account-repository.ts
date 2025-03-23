import {
  AccountRepository,
  FindByProviderAndId,
  FindByUserIdAndProvider,
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

    if (!account) return null

    return PrismaAccountMapper.toDomain(account)
  }

  async findByUserId(userId: string): Promise<Account[] | null> {
    const account = await this.prisma.account.findMany({
      where: { userId },
    })

    return account.map(PrismaAccountMapper.toDomain)
  }

  async findByProviderAndId({
    provider,
    providerId,
  }: FindByProviderAndId): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    })

    if (!account) return null

    return PrismaAccountMapper.toDomain(account)
  }

  async findByUserIdAndProvider({
    userId,
    provider,
  }: FindByUserIdAndProvider): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        provider,
      },
    })

    if (!account) return null

    return PrismaAccountMapper.toDomain(account)
  }

  async create(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account)

    await this.prisma.account.create({ data })
  }
}