import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface AccountProps {
  userId: UniqueEntityID
  name: string
  provider: AUTH_METHOD
  providerId?: string | null
  createdAt: Date
}

export class Account extends Entity<AccountProps> {
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

  get providerId(): string | undefined | null {
    return this.props.providerId
  }

  static create(
    props: Optional<AccountProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    return new Account(
      {
        ...props,
        providerId: props.providerId ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
