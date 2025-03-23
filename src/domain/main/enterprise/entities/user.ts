import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import { Password } from './value-objects/password'

export interface UserProps {
  email: string
  password: Password | null
  createdAt: Date
}

export class User extends Entity<UserProps> {
  get email(): string {
    return this.props.email
  }

  get password(): Password | undefined | null {
    return this.props.password
  }

  set password(password: Password | null) {
    this.props.password = password
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'password'>,
    id?: UniqueEntityID
  ) {
    return new User(
      {
        ...props,
        password: props.password ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
