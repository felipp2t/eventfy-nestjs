import { AuthenticateByEmailUseCase } from '@domain/main/app/use-cases/authenticate-by-email'
import { AuthenticateByProviderUseCase } from '@domain/main/app/use-cases/authenticate-by-provider'
import { CreateAccountByEmailUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { EmailVerificationForPasswordRecoveryUseCase } from '@domain/main/app/use-cases/email-verification-for-password-recovery'
import { RefreshTokenUseCase } from '@domain/main/app/use-cases/refresh-token'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateByEmailController } from './controllers/authenticate-by-email.controller'
import { CreateAccountByEmailController } from './controllers/create-account-by-email.controller'
import { EmailVerificationForPasswordRecoveryController } from './controllers/email-verification-for-password-recovery.controller'
import { AuthenticateByGoogleController } from './controllers/google/authenticate-account-by-google.controller'
import { RefreshTokenController } from './controllers/refresh-token.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountByEmailController,
    AuthenticateByEmailController,
    RefreshTokenController,
    AuthenticateByGoogleController,
    EmailVerificationForPasswordRecoveryController,
  ],
  providers: [
    CreateAccountByEmailUseCase,
    AuthenticateByEmailUseCase,
    RefreshTokenUseCase,
    AuthenticateByProviderUseCase,
    EmailVerificationForPasswordRecoveryUseCase,
  ],
})
export class HttpModule {}
