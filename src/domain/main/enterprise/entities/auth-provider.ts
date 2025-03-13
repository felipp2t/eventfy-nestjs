import { AUTH_PROVIDERS } from 'src/core/constants/auth-provider'
import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

interface AuthProviderProps {
  userId: UniqueEntityID
  name: string
  provider: AUTH_PROVIDERS
  createdAt: Date
}

export class AuthProvider extends Entity<AuthProviderProps> {
  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get name(): string {
    return this.props.name
  }

  get provider(): AUTH_PROVIDERS {
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
