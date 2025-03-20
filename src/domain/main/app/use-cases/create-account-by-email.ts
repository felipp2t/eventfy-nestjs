import { EmailAlreadyInUse } from '@domain/main/app/use-cases/errors/email-already-in-use'
import { Account } from '@domain/main/enterprise/entities/account'
import { User } from '@domain/main/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, left, right } from 'src/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashGenerator } from '../cryptography/hash-generator'
import { AccountRepository } from '../repositories/account-repository'
import { UserRepository } from '../repositories/user-repository'

interface CreateAccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateAccountUseCaseResponse = Either<EmailAlreadyInUse, object>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      const hashedPassword = await this.hashGenerator.hash(password)

      const newUser = User.create({
        email,
        password: hashedPassword,
      })

      const newAccount = Account.create({
        name,
        userId: newUser.id,
        provider: AUTH_METHOD.EMAIL,
      })

      await this.userRepository.create(newUser)
      await this.accountRepository.create(newAccount)

      return right({})
    }

    const accounts = await this.accountRepository.findByUserId(
      user.id.toString()
    )

    if (accounts?.some(p => p.provider === AUTH_METHOD.EMAIL)) {
      return left(new EmailAlreadyInUse())
    }

    const account = Account.create({
      name,
      userId: user.id,
      provider: AUTH_METHOD.EMAIL,
    })

    await this.accountRepository.create(account)

    return right({})
  }
}
