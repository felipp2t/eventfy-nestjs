import { User } from '@domain/main/enterprise/entities/user'

export interface UpdatePassword {
  userId: string
  password: string
}

export abstract class UserRepository {
  abstract findByEmail: (email: string) => Promise<User | null>
  abstract findById: (id: string) => Promise<User | null>
  abstract create: (user: User) => Promise<void>
  abstract updatePassword: ({
    userId,
    password,
  }: UpdatePassword) => Promise<void>
}
