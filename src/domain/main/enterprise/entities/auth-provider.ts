import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface AuthProviderProps {
  userId: UniqueEntityID
  name: string
  provider: AUTH_METHOD
  createdAt: Date
}

export class AuthProvider extends Entity<AuthProviderProps> {
  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get name(): string {
    return this.props.name
  }

  get provider(): AUTH_METHOD {
    return this.props.provider
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(
    props: Optional<AuthProviderProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    return new AuthProvider(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
