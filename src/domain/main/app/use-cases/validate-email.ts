import { Either, left, right } from 'src/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { UserRepository } from '../repositories/user-repository'
import { UserNotFound } from './errors/user-not-found'
import { Injectable } from '@nestjs/common'

interface ValidateEmailUseCaseRequest {
  email: string
}

type ValidateEmailUseCaseResponse = Either<
  UserNotFound,
  {
    token: string
  }
>

@Injectable()
export class ValidateEmailUseCase {
  constructor(
    private userRepository: UserRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
  }: ValidateEmailUseCaseRequest): Promise<ValidateEmailUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new UserNotFound())
    }

    const token = await this.encrypter.encrypt({ sub: user.id }, '1h')

    return right({
      token,
    })
  }
}
