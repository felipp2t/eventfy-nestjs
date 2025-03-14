import { AuthTokenRepository } from '@domain/main/app/repositories/auth-token-repository.js'
import { AuthToken } from '@domain/main/enterprise/entities/auth-token.js'
import { Injectable } from '@nestjs/common'
import { PrismaAuthTokenMapper } from '../mappers/prisma-token-mapper.js'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class PrismaAuthTokenRepository implements AuthTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(token: AuthToken): Promise<void> {
    const data = PrismaAuthTokenMapper.toPrisma(token)

    await this.prisma.authToken.create({ data })
  }

  async findByRefreshToken(refreshToken: string): Promise<AuthToken | null> {
    const token = await this.prisma.authToken.findUnique({
      where: { refreshToken },
    })

    if (!token) return null

    return PrismaAuthTokenMapper.toDomain(token)
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.authToken.deleteMany({
      where: { userId },
    })
  }
}
