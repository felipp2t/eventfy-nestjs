import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { AuthToken } from '@domain/main/enterprise/entities/auth-token'
import { User } from '@domain/main/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, right } from 'src/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { AuthProviderRepository } from '../repositories/auth-provider-repository'
import { AuthTokenRepository } from '../repositories/auth-token-repository'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateAccountByProviderUseCaseRequest {
  provider: AUTH_METHOD.GITHUB | AUTH_METHOD.GOOGLE
  email: string
  name: string
}

type AuthenticateAccountByProviderUseCaseResponse = Either<
  void,
  {
    token: {
      accessToken: string
      refreshToken: string
    }
  }
>

@Injectable()
export class AuthenticateAccountByProviderUseCase {
  constructor(
    private userRepository: UserRepository,
    private authProviderRepository: AuthProviderRepository,
    private authTokenRepository: AuthTokenRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    name,
    provider,
  }: AuthenticateAccountByProviderUseCaseRequest): Promise<AuthenticateAccountByProviderUseCaseResponse> {
    let user = await this.userRepository.findByEmail(email)

    if (!user) {
      user = User.create({ email })
      await this.userRepository.create(user)
    }

    let providerEntity =
      (await this.authProviderRepository
        .findByUserId(user.id.toString())
        .then(providers => providers?.find(p => p.provider === provider))) ||
      null

    if (!providerEntity) {
      providerEntity = AuthProvider.create({
        provider,
        userId: user.id,
        name,
      })
      await this.authProviderRepository.create(providerEntity)
    }

    return right({
      token: await this._generateAuthTokens(user, providerEntity),
    })
  }

  private async _generateAuthTokens(user: User, provider: AuthProvider) {
    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      email: user.email,
      name: provider.name,
    })

    const refreshToken = await this.encrypter.encrypt({ sub: user.id })

    const token = AuthToken.create({
      userId: user.id,
      providerId: provider.id,
      refreshToken,
    })

    await this.authTokenRepository.upsert(token)

    return {
      accessToken,
      refreshToken,
    }
  }
}
