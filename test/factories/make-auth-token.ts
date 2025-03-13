import {
  AuthToken,
  AuthTokenProps,
} from '@domain/main/enterprise/entities/auth-token'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

type MakeAuthToken = Partial<AuthTokenProps> & {
  days?: number
}

export const makeAuthToken = (
  { days, ...override }: MakeAuthToken = {},
  id?: UniqueEntityID
) => {
  return AuthToken.create(
    {
      providerId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      refreshToken: faker.internet.jwt({
        header: {
          exp: faker.date.soon({ days }),
          sub: new UniqueEntityID(override.userId?.toString()).toString(),
        },
      }),
      ...override,
    },
    id
  )
}
