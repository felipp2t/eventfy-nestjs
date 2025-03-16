import { Descrypter } from '@domain/main/app/cryptography/decrypter'
import { Encrypter } from '@domain/main/app/cryptography/encrypter'

export class FakeCrypto implements Encrypter, Descrypter {
  async decrypt<T extends object>(ciphertext: string): Promise<T> {
    const [header, payload, signature] = ciphertext.split('.')
    
     const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
    
    return JSON.parse(decodedPayload) as T
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
