import { AuthenticateByEmailUseCase } from '@domain/main/app/use-cases/authenticate-by-email'
import { CreateAccountByEmailUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateByEmailController } from './controllers/authenticate-by-email.controller'
import { CreateAccountByEmailController } from './controllers/create-account-by-email.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountByEmailController, AuthenticateByEmailController],
  providers: [CreateAccountByEmailUseCase, AuthenticateByEmailUseCase],
})
export class HttpModule {}
