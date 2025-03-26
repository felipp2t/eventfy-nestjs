import { Either, left, right } from 'src/core/types/either'
import { Encrypter } from '../cryptography/encrypter'
import { AccountRepository } from '../repositories/account-repository'
import { UserNotFound } from './errors/user-not-found'

interface EmailVerificationForPasswordRecoveryRequest {
  email: string
}

type EmailVerificationForPasswordRecoveryResponse = Either<
  UserNotFound,
  {
    token: string
  }
>

export class EmailVerificationForPasswordRecovery {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
  }: EmailVerificationForPasswordRecoveryRequest): Promise<EmailVerificationForPasswordRecoveryResponse> {
    const account = await this.accountRepository.findByEmail(email)

    if (!account) {
      return left(new UserNotFound())
    }

    const token = await this.encrypter.encrypt(
      {
        sub: account.id,
        email: account.email,
      },
      '1h'
    )

    return right({
      token,
    })
  }
}
