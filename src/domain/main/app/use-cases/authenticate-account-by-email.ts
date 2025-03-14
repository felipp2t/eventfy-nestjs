import { AuthToken } from '@domain/main/enterprise/entities/auth-token'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, left, right } from 'src/core/either'
import { WrongCredentials } from 'src/core/errors/errors/wrong-credentials'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AuthProviderRepository } from '../repositories/auth-provider-repository'
import { AuthTokenRepository } from '../repositories/auth-token-repository'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateAccountByEmailUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAccountByEmailUseCaseResponse = Either<
  WrongCredentials,
  {
    token: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class AuthenticateAccountByEmailUseCase {
  constructor(
    private userRepository: UserRepository,
    private authProviderRepository: AuthProviderRepository,
    private authTokenRepository: AuthTokenRepository,
    private hashComparer: HashComparer,
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

    const provider = await this.authProviderRepository.findByUserId(
      user.id.toString()
    )

    if (!provider) {
      return left(new WrongCredentials())
    }

    const emailProvider = provider.find(p => p.provider === AUTH_METHOD.EMAIL)

    if (!emailProvider) {
      return left(new WrongCredentials())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password!
    )

    if (!isPasswordValid) {
      return left(new WrongCredentials())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      email: user.email,
    })

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
      },
      '7d'
    )

    const token = AuthToken.create({
      providerId: emailProvider.id,
      userId: user.id,
      refreshToken,
    })

    await this.authTokenRepository.create(token)

    return right({
      token: {
        accessToken,
        refreshToken,
      },
    })
  }
}
