import { AccountRepository } from '@domain/main/app/repositories/account-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAccountRepository } from './prisma/repositories/prisma-account-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AccountRepository, useClass: PrismaAccountRepository },
  ],
  exports: [PrismaService, AccountRepository],
})
export class DatabaseModule {}
