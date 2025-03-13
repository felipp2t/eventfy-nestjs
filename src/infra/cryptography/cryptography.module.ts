import { Module } from '@nestjs/common'

import { Encrypter } from '../../domain/main/app/cryptography/encrypter.js'
import { HashComparer } from '../../domain/main/app/cryptography/hash-comparer.js'
import { HashGenerator } from '../../domain/main/app/cryptography/hash-generator.js'
import { BcryptHasher } from './bcrypt-hasher.js'
import { JwtEncrypter } from './jwt-encrypter.js'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
