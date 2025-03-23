import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import { Password } from './value-objects/password'

export interface AccountProps {
  email: string
  password: Password | null
  name: string
  provider: AUTH_METHOD
  providerId: string | null
  createdAt: Date
}

export class Account extends Entity<AccountProps> {
  get email(): string {
    return this.props.email
  }

  get password(): Password | null {
    return this.props.password
  }

  set password(password: Password | null) {
    this.props.password = password
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
    props: Optional<AccountProps, 'createdAt' | 'password' | 'providerId'>,
    id?: UniqueEntityID
  ) {
    return new Account(
      {
        ...props,
        password: props.password ?? null,
        providerId: props.providerId ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
