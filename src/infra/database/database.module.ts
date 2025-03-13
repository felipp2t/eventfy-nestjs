import { AuthProviderRepository } from '@domain/main/app/repositories/auth-provider-repository'
import { AuthTokenRepository } from '@domain/main/app/repositories/auth-token-repository'
import { UserRepository } from '@domain/main/app/repositories/user-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAuthProviderRepository } from './prisma/repositories/prisma-auth-provider-repository'
import { PrismaAuthTokenRepository } from './prisma/repositories/prisma-auth-token-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: AuthProviderRepository, useClass: PrismaAuthProviderRepository },
    { provide: AuthTokenRepository, useClass: PrismaAuthTokenRepository },
  ],
  exports: [
    PrismaService,
    UserRepository,
    AuthProviderRepository,
    AuthTokenRepository,
  ],
})
export class DatabaseModule {}
