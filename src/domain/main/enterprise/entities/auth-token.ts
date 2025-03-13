import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface AuthTokenProps {
  refreshToken: string
  userId: UniqueEntityID
  providerId: UniqueEntityID
  createdAt: Date
}

export class AuthToken extends Entity<AuthTokenProps> {
  get refreshToken() {
    return this.props.refreshToken
  }

  get userId() {
    return this.props.userId
  }

  get providerId() {
    return this.props.providerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<AuthTokenProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    return new AuthToken(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
