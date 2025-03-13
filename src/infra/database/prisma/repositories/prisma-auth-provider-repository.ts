import { AuthProviderRepository } from '@domain/main/app/repositories/auth-provider-repository'
import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { Injectable } from '@nestjs/common'
import { AUTH_PROVIDERS } from 'src/core/constants/auth-provider'
import { PrismaProviderMapper } from '../mappers/prisma-provider-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAuthProviderRepository implements AuthProviderRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AuthProvider | null> {
    const provider = await this.prisma.authProvider.findUnique({
      where: { id },
    })

    if (!provider) return null

    return PrismaProviderMapper.toDomain(provider)
  }

  async findByUserId(userId: string): Promise<AuthProvider[] | null> {
    const providers = await this.prisma.authProvider.findMany({
      where: { userId },
    })

    if (!providers) return null

    return providers.map(PrismaProviderMapper.toDomain)
  }

  async findByProvider(
    provider: AUTH_PROVIDERS
  ): Promise<AuthProvider[] | null> {
    const user = await this.prisma.authProvider.findMany({
      where: { name: provider },
    })

    if (!user) return null

    return user.map(u => PrismaProviderMapper.toDomain(u))
  }

  async create(provider: AuthProvider): Promise<void> {
    const data = PrismaProviderMapper.toPrisma(provider)

    await this.prisma.authProvider.create({ data })
  }
}
