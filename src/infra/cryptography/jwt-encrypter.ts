import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Encrypter } from 'src/domain/main/app/cryptography/encrypter.js'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(
    payload: Record<string, unknown>,
    expiresIn: string | number = '1d'
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn,
    })
  }
}
