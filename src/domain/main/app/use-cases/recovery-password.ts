import { isAfter } from 'date-fns'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Either, left, right } from 'src/core/either'
import { Descrypter } from '../cryptography/decrypter'
import { HashGenerator } from '../cryptography/hash-generator'
import { AccountRepository } from '../repositories/account-repository'
import { UserRepository } from '../repositories/user-repository'
import { InvalidPasswordConfirmation } from './errors/invalid-password-confirmation'
import { InvalidToken } from './errors/invalid-token'
import { UserNotFound } from './errors/user-not-found'

interface RecoveryPasswordUseCaseRequest {
  token: string
  password: string
  passwordConfirmation: string
}

type RecoveryPasswordUseCaseResponse = Either<
  InvalidToken | InvalidPasswordConfirmation | UserNotFound,
  null
>

export class RecoveryPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private hashGenerator: HashGenerator,
    private descrypter: Descrypter
  ) {}

  async execute({
    token,
    password,
    passwordConfirmation,
  }: RecoveryPasswordUseCaseRequest): Promise<RecoveryPasswordUseCaseResponse> {
    const payload = await this.descrypter.decrypt<{
      sub: string
      exp: number
    }>(token)

    const expDate = new Date(payload.exp * 1000)
    const currentDate = new Date()

    if (isAfter(currentDate, expDate)) {
      return left(new InvalidToken())
    }

    const user = await this.userRepository.findById(payload.sub)

    if (!user) {
      return left(new InvalidToken())
    }

    const account = await this.accountRepository.findByUserIdAndProvider({
      userId: user.id.toString(),
      provider: AUTH_METHOD.EMAIL,
    })

    if (!account) {
      return left(new UserNotFound())
    }

    if (password !== passwordConfirmation) {
      return left(new InvalidPasswordConfirmation())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    await this.userRepository.updatePassword({
      userId: user.id.toString(),
      password: hashedPassword,
    })

    return right(null)
  }
}
