import { SessionRepository } from '@domain/main/app/repositories/session-repository.js'
import { Session } from '@domain/main/enterprise/entities/session.js'
import { Injectable } from '@nestjs/common'
import { PrismaSessionMapper } from '../mappers/prisma-session-mapper.js'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async create(session: Session): Promise<void> {
    const data = PrismaSessionMapper.toPrisma(session)

    await this.prisma.session.create({ data })
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    const token = await this.prisma.session.findUnique({
      where: { refreshToken },
    })

    if (!token) return null

    return PrismaSessionMapper.toDomain(token)
  }

  async remove({
    userId,
    accountId,
  }: { userId: string; accountId: string }): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId, accountId },
    })
  }

  async upsert(session: Session): Promise<void> {
    const data = PrismaSessionMapper.toPrisma(session)

    await this.prisma.session.upsert({
      where: {
        userId_accountId: {
          userId: session.userId.toString(),
          accountId: session.accountId.toString(),
        },
      },
      update: data,
      create: data,
    })
  }
}