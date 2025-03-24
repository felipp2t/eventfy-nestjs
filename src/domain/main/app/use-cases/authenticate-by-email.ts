import { Session } from '@domain/main/enterprise/entities/session'
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

export class AuthenticateByEmailUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly encrypter: Encrypter,
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
    })

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: account.id.toString(),
        providerId: account.id,
      },
      '7d'
    )

    const session = Session.create({
      accountId: account.id,
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
