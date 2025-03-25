import { Session } from '@domain/main/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { isAfter } from 'date-fns'
import { Either, left, right } from 'src/core/types/either'
import { Descrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { AccountRepository } from '../repositories/account-repository'
import { SessionRepository } from '../repositories/session-repository'
import { InvalidToken } from './errors/invalid-token'
import { UserNotFound } from './errors/user-not-found'

interface RefreshTokenUseCaseRequest {
  refreshToken: string
}

type RefreshTokenUseCaseResponse = Either<
  InvalidToken | UserNotFound,
  {
    session: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly accountrRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly descrypter: Descrypter,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const payload = await this.descrypter.decrypt<{
      sub: string
      accountId: string
      exp: number
    }>(refreshToken)

    const expDate = new Date(payload.exp * 1000)
    const currentDate = new Date()

    if (isAfter(currentDate, expDate)) {
      return left(new InvalidToken())
    }

    const account = await this.accountrRepository.findById(payload.sub)

    if (!account) {
      return left(new UserNotFound())
    }

    const newAccessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
      email: account.email,
      name: account.name,
      provider: account.provider,
    })

    const newRefreshToken = await this.encrypter.encrypt(
      { sub: account.id.toString() },
      '7d'
    )

    const session = await this.sessionRepository.findByAccountId(
      account.id.toString()
    )

    const newSession = Session.create(
      {
        accountId: account.id,
        refreshToken: newRefreshToken,
      },
      session?.id
    )

    await this.sessionRepository.upsert(newSession)

    return right({
      session: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    })
  }
}
