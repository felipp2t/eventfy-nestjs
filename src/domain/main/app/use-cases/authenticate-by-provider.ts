import { Account } from '@domain/main/enterprise/entities/account'
import { Session } from '@domain/main/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, right } from 'src/core/types/either'
import { Encrypter } from '../cryptography/encrypter'
import { AccountRepository } from '../repositories/account-repository'
import { SessionRepository } from '../repositories/session-repository'

interface AuthenticateByProviderUseCaseRequest {
  provider: AUTH_METHOD.GITHUB | AUTH_METHOD.GOOGLE
  sub: string
  email: string
  name: string
}

type AuthenticateByProviderUseCaseResponse = Either<
  null,
  {
    session: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class AuthenticateByProviderUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private sessionRepository: SessionRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    sub,
    email,
    name,
    provider,
  }: AuthenticateByProviderUseCaseRequest): Promise<AuthenticateByProviderUseCaseResponse> {
    let account = await this.accountRepository.findByEmail(email)

    if (!account) {
      account = Account.create({
        email,
        name,
        provider: AUTH_METHOD.GOOGLE,
        providerId: sub,
      })

      await this.accountRepository.create(account)
    }

    const session = await this.sessionRepository.findByAccountId(
      account.id.toString()
    )

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
      email: account.email,
      name: account.name,
      provider: account.provider,
    })

    const refreshToken = await this.encrypter.encrypt(
      { sub: account.id.toString() },
      '7d'
    )

    const newSession = Session.create(
      {
        accountId: account.id,
        refreshToken,
      },
      session?.id
    )

    await this.sessionRepository.upsert(newSession)

    return right({
      session: {
        accessToken,
        refreshToken,
      },
    })
  }
}
