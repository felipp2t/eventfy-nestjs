import { Account } from '@domain/main/enterprise/entities/account'
import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, left, right } from 'src/core/types/either'
import { AccountRepository } from '../repositories/account-repository'
import { EmailAlreadyInUse } from './errors/email-already-in-use'

interface CreateAccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateAccountUseCaseResponse = Either<EmailAlreadyInUse, null>

@Injectable()
export class CreateAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(email)

    if (account) {
      return left(new EmailAlreadyInUse())
    }

    const newAccount = Account.create({
      email,
      name,
      password: await Password.create(password),
      provider: AUTH_METHOD.EMAIL,
    })

    await this.accountRepository.create(newAccount)
    return right(null)
  }
}
