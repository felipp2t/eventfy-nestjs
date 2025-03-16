import { AuthenticateAccountByEmailUseCase } from '@domain/main/app/use-cases/authenticate-account-by-email'
import { CreateAccountUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { RefreshTokenUseCase } from '@domain/main/app/use-cases/refresh-token'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateAccountByEmailController } from './controllers/authenticate-account-by-email.controller'
import { CreateAccountController } from './controllers/create-account-by-email.controller'
import { RefreshTokenController } from './controllers/refresh-token.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateAccountByEmailController,
    RefreshTokenController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateAccountByEmailUseCase,
    RefreshTokenUseCase,
  ],
})
export class HttpModule {}
