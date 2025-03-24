import { AccountRepository } from '@domain/main/app/repositories/account-repository'
import { SessionRepository } from '@domain/main/app/repositories/session-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAccountRepository } from './prisma/repositories/prisma-account-repository'
import { PrismaSessionRepository } from './prisma/repositories/prisma-session-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AccountRepository, useClass: PrismaAccountRepository },
    { provide: SessionRepository, useClass: PrismaSessionRepository },
  ],
  exports: [PrismaService, AccountRepository, SessionRepository],
})
export class DatabaseModule {}
