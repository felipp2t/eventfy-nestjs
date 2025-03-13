import { AuthProvider } from '@domain/main/enterprise/entities/auth-provider'
import { AuthToken } from '@domain/main/enterprise/entities/auth-token'
import { User } from '@domain/main/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { AUTH_PROVIDERS } from 'src/core/constants/auth-provider'
import { Either, left, right } from 'src/core/either'
import { EmailAlreadyInUse } from 'src/core/errors/errors/email-already-in-use'
import { Encrypter } from '../cryptography/encrypter'
import { HashGenerator } from '../cryptography/hash-generator'
import { AuthProviderRepository } from '../repositories/auth-provider-repository'
import { AuthTokenRepository } from '../repositories/auth-token-repository'
import { UserRepository } from '../repositories/user-repository'

interface CreateAccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateAccountUseCaseResponse = Either<
  EmailAlreadyInUse,
  {
    accessToken: string
    refreshToken: string
  }
>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly providerRepository: AuthProviderRepository,
    private readonly tokenRepository: AuthTokenRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      const hashedPassword = await this.hashGenerator.hash(password)

      const newUser = User.create({
        email,
        password: hashedPassword,
      })

      const newProvider = AuthProvider.create({
        name,
        userId: newUser.id,
        provider: AUTH_PROVIDERS.EMAIL,
      })

      const accessToken = await this.encrypter.encrypt({
        sub: newUser.id.toString(),
        email: newUser.email,
      })

      const refreshToken = await this.encrypter.encrypt({
        sub: newUser.id.toString(),
      })

      const newToken = AuthToken.create({
        providerId: newProvider.id,
        userId: newUser.id,
        refreshToken,
      })

      await this.userRepository.create(newUser)
      await this.providerRepository.create(newProvider)
      await this.tokenRepository.create(newToken)

      return right({
        accessToken,
        refreshToken,
      })
    }

    const providers = await this.providerRepository.findByUserId(
      user.id.toString()
    )

    if (providers?.some(p => p.provider === AUTH_PROVIDERS.EMAIL)) {
      return left(new EmailAlreadyInUse())
    }

    const newProvider = AuthProvider.create({
      name,
      userId: user.id,
      provider: AUTH_PROVIDERS.EMAIL,
    })

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      email: user.email,
    })

    const refreshToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    const newToken = AuthToken.create({
      providerId: newProvider.id,
      userId: user.id,
      refreshToken,
    })

    await this.providerRepository.create(newProvider)
    await this.tokenRepository.create(newToken)

    return right({
      accessToken,
      refreshToken,
    })
  }
}
