import { WrongCredentials } from '@domain/main/app/use-cases/errors/wrong-credentials'
import { Session } from '@domain/main/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, left, right } from 'src/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AccountRepository } from '../repositories/account-repository'
import { SessionRepository } from '../repositories/session-repository'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateAccountByEmailUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAccountByEmailUseCaseResponse = Either<
  WrongCredentials,
  {
    session: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class AuthenticateAccountByEmailUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private sessionRepository: SessionRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAccountByEmailUseCaseRequest): Promise<AuthenticateAccountByEmailUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentials())
    }

    const accounts = await this.accountRepository.findByUserId(
      user.id.toString()
    )

    const account = accounts?.find(p => p.provider === AUTH_METHOD.EMAIL)

    if (!account) {
      return left(new WrongCredentials())
    }

    if (!user.password?.compare(password)) {
      return left(new WrongCredentials())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      email: user.email,
    })

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
        providerId: account.id,
      },
      '7d'
    )

    const session = Session.create({
      accountId: account.id,
      userId: user.id,
      refreshToken,
    })

    await this.sessionRepository.create(session)

    return right({
      session: {
        accessToken,
        refreshToken,
      },
    })
  }
}
