import { Account } from '@domain/main/enterprise/entities/account'
import { Session } from '@domain/main/enterprise/entities/session'
import { User } from '@domain/main/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, right } from 'src/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { AccountRepository } from '../repositories/account-repository'
import { SessionRepository } from '../repositories/session-repository'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateAccountByProviderUseCaseRequest {
  provider: AUTH_METHOD.GITHUB | AUTH_METHOD.GOOGLE
  sub: string
  email: string
  name: string
}

type AuthenticateAccountByProviderUseCaseResponse = Either<
  undefined,
  {
    session: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class AuthenticateAccountByProviderUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private sessinRepository: SessionRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    sub,
    email,
    name,
    provider,
  }: AuthenticateAccountByProviderUseCaseRequest): Promise<AuthenticateAccountByProviderUseCaseResponse> {
    let user = await this.userRepository.findByEmail(email)

    if (!user) {
      user = User.create({ email })
      await this.userRepository.create(user)
    }

    let account = await this.accountRepository.findByProviderAndId({
      provider,
      providerId: sub,
    })

    if (!account) {
      account = Account.create({
        provider,
        providerId: sub,
        userId: user.id,
        name,
      })

      await this.accountRepository.create(account)
    }

    return right({
      session: await this._generateAuthTokens(user, account),
    })
  }

  private async _generateAuthTokens(user: User, account: Account) {
    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      email: user.email,
      name: account.name,
    })

    const refreshToken = await this.encrypter.encrypt({ sub: user.id })

    const session = Session.create({
      userId: user.id,
      accountId: account.id,
      refreshToken,
    })

    await this.sessinRepository.upsert(session)

    return {
      accessToken,
      refreshToken,
    }
  }
}
