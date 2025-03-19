import { AccountRepository } from '@domain/main/app/repositories/account-repository'
import { SessionRepository } from '@domain/main/app/repositories/session-repository'
import { UserRepository } from '@domain/main/app/repositories/user-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAccountRepository } from './prisma/repositories/prisma-account-repository'
import { PrismaSessionRepository } from './prisma/repositories/prisma-session-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: AccountRepository, useClass: PrismaAccountRepository },
    { provide: SessionRepository, useClass: PrismaSessionRepository },
  ],
  exports: [
    PrismaService,
    UserRepository,
    AccountRepository,
    SessionRepository,
  ],
})
export class DatabaseModule {}
