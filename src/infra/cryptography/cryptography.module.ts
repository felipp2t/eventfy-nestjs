import { Module } from '@nestjs/common'

import { Encrypter } from '@domain/main/app/cryptography/encrypter.js'
import { HashComparer } from '@domain/main/app/cryptography/hash-comparer.js'
import { HashGenerator } from '@domain/main/app/cryptography/hash-generator.js'
import { EnvModule } from '@infra/env/env.module.js'
import { EnvService } from '@infra/env/env.service.js'
import { BcryptHasher } from './bcrypt-hasher.js'
import { JwtEncrypter } from './jwt-encrypter.js'
import { Descrypter } from '@domain/main/app/cryptography/decrypter.js'

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
