import { Module } from '@nestjs/common'

import { Encrypter } from '@domain/main/app/cryptography/encrypter'
import { HashComparer } from '@domain/main/app/cryptography/hash-comparer'
import { HashGenerator } from '@domain/main/app/cryptography/hash-generator'
import { EnvModule } from '@infra/env/env.module'
import { EnvService } from '@infra/env/env.service'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'
import { Descrypter } from '@domain/main/app/cryptography/decrypter'

@Module({
  imports: [EnvModule],
  providers: [
    EnvService,
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: Descrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, Descrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
