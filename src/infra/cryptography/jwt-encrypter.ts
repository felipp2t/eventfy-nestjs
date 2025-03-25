import { Descrypter } from '@domain/main/app/cryptography/decrypter'
import { Encrypter } from '@domain/main/app/cryptography/encrypter'
import { EnvService } from '@infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEncrypter implements Encrypter, Descrypter {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService
  ) {}

  encrypt(
    payload: Record<string, unknown>,
    expiresIn: string | number = '1d'
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        iat: Date.now(),
      },
      {
        privateKey: this.envService.get('JWT_PRIVATE_KEY'),
        algorithm: 'RS256',
        expiresIn,
      }
    )
  }

  decrypt<T extends object>(ciphertext: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(ciphertext, {
      algorithms: ['RS256'],
      publicKey: this.envService.get('JWT_PUBLIC_KEY'),
    })
  }
}
