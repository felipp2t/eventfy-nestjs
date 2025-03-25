import { AuthenticateByEmailUseCase } from '@domain/main/app/use-cases/authenticate-by-email'
import { AuthenticateByProviderUseCase } from '@domain/main/app/use-cases/authenticate-by-provider'
import { CreateAccountByEmailUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { RefreshTokenUseCase } from '@domain/main/app/use-cases/refresh-token'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateByEmailController } from './controllers/authenticate-by-email.controller'
import { CreateAccountByEmailController } from './controllers/create-account-by-email.controller'
import { AuthenticateByGoogleController } from './controllers/google/authenticate-account-by-google.controller'
import { RefreshTokenController } from './controllers/refresh-token.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountByEmailController,
    AuthenticateByEmailController,
    RefreshTokenController,
    AuthenticateByGoogleController,
  ],
  providers: [
    CreateAccountByEmailUseCase,
    AuthenticateByEmailUseCase,
    RefreshTokenUseCase,
    AuthenticateByProviderUseCase,
  ],
})
export class HttpModule {}
