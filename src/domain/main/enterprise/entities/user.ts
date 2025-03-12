import { Entity } from 'core/entities/entity'
import { UniqueEntityID } from 'core/entities/unique-entity-id'
import { Optional } from 'core/types/optional'

interface UserProps {
  email: string
  password?: string | null
  createdAt: Date
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
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
