import {
  UpdatePassword,
  UserRepository,
} from '@domain/main/app/repositories/user-repository'
import { User } from '@domain/main/enterprise/entities/user'
import { Password } from '@domain/main/enterprise/entities/value-objects/password'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find(user => user.email === email) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find(user => user.id.toString() === id) || null
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async updatePassword({ userId, password }: UpdatePassword): Promise<void> {
    const user = this.items.find(user => user.id.toString() === userId)

    if (!user) return

    user.password = await Password.create(password)
  }
}
