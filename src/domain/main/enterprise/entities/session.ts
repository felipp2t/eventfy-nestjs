import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface SessionProps {
  refreshToken: string
  userId: UniqueEntityID
  accountId: UniqueEntityID
  createdAt: Date
}

export class Session extends Entity<SessionProps> {
  get refreshToken(): string {
    return this.props.refreshToken
  }

  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get accountId(): UniqueEntityID {
    return this.props.accountId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(
    props: Optional<SessionProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    return new Session(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
