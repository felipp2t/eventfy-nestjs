import {
  AuthProvider,
  AuthProviderProps,
} from '@domain/main/enterprise/entities/auth-provider'
import { faker } from '@faker-js/faker'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export const makeAuthProvider = (
  override: Partial<AuthProviderProps> = {},
  id?: UniqueEntityID
) => {
  return AuthProvider.create(
    {
      name: faker.person.fullName(),
      provider: AUTH_METHOD.EMAIL,
      userId: new UniqueEntityID(),
      ...override,
    },
    id
  )
}
