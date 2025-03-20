import { hash, compare } from 'bcryptjs'

export class Password {
  private constructor(private readonly value: string) {}

  static async create(plainText: string): Promise<Password> {
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