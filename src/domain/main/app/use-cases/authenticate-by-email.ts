import { Session } from '@domain/main/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/types/either'
import { Encrypter } from '../cryptography/encrypter'
import { AccountRepository } from '../repositories/account-repository'
import { SessionRepository } from '../repositories/session-repository'
import { WrongCredentials } from './errors/wrong-credentials'

interface AuthenticateByEmailRequest {
  email: string
  password: string
}

type AuthenticateByEmailResponse = Either<
  WrongCredentials,
  {
    session: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class AuthenticateByEmailUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateByEmailRequest): Promise<AuthenticateByEmailResponse> {
    const account = await this.accountRepository.findByEmail(email)

    if (!account) {
      return left(new WrongCredentials())
    }

    const passwordMatches = await account.password?.compare(password)

    if (!passwordMatches) {
      return left(new WrongCredentials())
    }

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

    const session = await this.sessionRepository.findByAccountId(
      account.id.toString()
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
