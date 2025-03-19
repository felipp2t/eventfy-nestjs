import { Session } from '@domain/main/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { isAfter } from 'date-fns'
import { Either, left, right } from 'src/core/either'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Descrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { SessionRepository } from '../repositories/session-repository'
import { UserRepository } from '../repositories/user-repository'
import { InvalidToken } from './errors/invalid-token'

interface RefreshTokenUseCaseRequest {
  refreshToken: string
}

type RefreshTokenUseCaseResponse = Either<
  InvalidToken,
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
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private descrypter: Descrypter,
    private encrypter: Encrypter
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

    const user = await this.userRepository.findById(payload.sub)

    await this.sessionRepository.remove({
      userId: payload.sub,
      accountId: payload.accountId,
    })

    const newAccessToken = await this.encrypter.encrypt({
      sub: payload.sub,
      email: user!.email,
    })

    const newRefreshToken = await this.encrypter.encrypt(
      {
        sub: payload.sub,
        accountId: payload.accountId,
      },
      '7d'
    )

    const session = Session.create({
      accountId: new UniqueEntityID(payload.accountId),
      userId: new UniqueEntityID(payload.sub),
      refreshToken,
    })

    await this.sessionRepository.create(session)

    return right({
      session: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    })
  }
}
