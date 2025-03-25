import { SessionRepository } from '@domain/main/app/repositories/session-repository.js'
import { Session } from '@domain/main/enterprise/entities/session.js'
import { Injectable } from '@nestjs/common'
import { PrismaSessionMapper } from '../mappers/prisma-session-mapper.js'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async findByAccountId(accountId: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { accountId },
    })

    return session ? PrismaSessionMapper.toDomain(session) : null
  }

  async upsert(session: Session): Promise<void> {
    await this.prisma.session.upsert({
      where: { id: session.id.toString() },
      update: PrismaSessionMapper.toPrisma(session),
      create: PrismaSessionMapper.toPrisma(session),
    })
  }
}
