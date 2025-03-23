import { compare, hash } from 'bcryptjs'
import { passwordPolicy } from 'src/core/constants/password-policy'

export class Password {
  private constructor(private readonly value: string) {}

  static async create(plainText: string): Promise<Password> {
    if (!passwordPolicy.validate(plainText)) {
      throw new Error(passwordPolicy.message)
    }

    const hashed = await hash(plainText, 8)
    return new Password(hashed)
  }

  static fromHash(hashed: string): Password {
    return new Password(hashed)
  }

  getHash(): string {
    return this.value
  }

  async compare(plainText: string): Promise<boolean> {
    return compare(plainText, this.value)
  }
}
