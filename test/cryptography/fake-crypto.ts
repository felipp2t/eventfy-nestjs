import { Descrypter } from '@domain/main/app/cryptography/decrypter'
import { Encrypter } from '@domain/main/app/cryptography/encrypter'
import { JwtService } from '@nestjs/jwt'

export class FakeCrypto implements Encrypter, Descrypter {
  async decrypt<T extends object>(ciphertext: string): Promise<T> {
    return new JwtService().decode(ciphertext) as T
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
