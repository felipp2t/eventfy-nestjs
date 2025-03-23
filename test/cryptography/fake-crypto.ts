import { Descrypter } from '@domain/main/app/cryptography/decrypter'
import { Encrypter } from '@domain/main/app/cryptography/encrypter'

export class FakeCrypto implements Encrypter, Descrypter {
  async decrypt<T extends object>(ciphertext: string): Promise<T> {
    return JSON.parse(ciphertext) as T
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}