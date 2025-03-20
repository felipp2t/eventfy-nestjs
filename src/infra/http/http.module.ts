import { AuthenticateAccountByEmailUseCase } from '@domain/main/app/use-cases/authenticate-account-by-email'
import { AuthenticateAccountByProviderUseCase } from '@domain/main/app/use-cases/authenticate-account-by-provider'
import { CreateAccountUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { RefreshTokenUseCase } from '@domain/main/app/use-cases/refresh-token'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateAccountByEmailController } from './controllers/authenticate-account-by-email.controller'
import { CreateAccountController } from './controllers/create-account-by-email.controller'
import { AuthenticateAccountByGoogleController } from './controllers/providers/google/authenticate-account-by-google.controller'
import { RefreshTokenController } from './controllers/refresh-token.controller'
import { ValidateEmailController } from './controllers/validate-email.controller'
import { ValidateEmailUseCase } from '@domain/main/app/use-cases/validate-email'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateAccountByEmailController,
    RefreshTokenController,
    AuthenticateAccountByGoogleController,
    ValidateEmailController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateAccountByEmailUseCase,
    RefreshTokenUseCase,
    AuthenticateAccountByProviderUseCase,
    ValidateEmailUseCase
  ],
})
export class HttpModule {}
