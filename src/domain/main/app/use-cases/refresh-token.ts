import { AuthToken } from '@domain/main/enterprise/entities/auth-token'
import { Injectable } from '@nestjs/common'
import { isAfter } from 'date-fns'
import { Either, left, right } from 'src/core/either'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Descrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { AuthTokenRepository } from '../repositories/auth-token-repository'
import { UserRepository } from '../repositories/user-repository'
import { InvalidToken } from './errors/invalid-token'

interface RefreshTokenUseCaseRequest {
  refreshToken: string
}

type RefreshTokenUseCaseResponse = Either<
  InvalidToken,
  {
    token: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private authTokenRepository: AuthTokenRepository,
    private descrypter: Descrypter,
    private encrypter: Encrypter
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const payload = await this.descrypter.decrypt<{
      sub: string
      providerId: string
      exp: Date
    }>(refreshToken)

    const currentDate = new Date()

    if (isAfter(currentDate, payload.exp)) {
      return left(new InvalidToken())
    }

    const user = await this.userRepository.findById(payload.sub)

    await this.authTokenRepository.remove({
      userId: payload.sub,
      providerId: payload.providerId,
    })

    const newAccessToken = await this.encrypter.encrypt({
      sub: payload.sub,
      email: user!.email,
    })

    const newRefreshToken = await this.encrypter.encrypt(
      {
        sub: payload.sub,
        providerId: payload.providerId,
      },
      '7d'
    )

    const token = AuthToken.create({
      providerId: new UniqueEntityID(payload.providerId),
      userId: new UniqueEntityID(payload.sub),
      refreshToken,
    })

    await this.authTokenRepository.create(token)

    return right({
      token: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    })
  }
}
