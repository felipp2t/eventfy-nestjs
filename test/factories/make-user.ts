import { User, UserProps } from '@domain/main/enterprise/entities/user'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export const makeUser = (
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) => {
  return User.create({
    email: faker.internet.email(),
    ...override,
  }, id)
}
