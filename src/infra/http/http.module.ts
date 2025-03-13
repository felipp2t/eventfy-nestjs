import { CreateAccountUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account-by-email.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [CreateAccountUseCase],
})
export class HttpModule {}
