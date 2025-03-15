import { AuthenticateAccountByEmailUseCase } from '@domain/main/app/use-cases/authenticate-account-by-email'
import { WrongCredentials } from '@domain/main/app/use-cases/errors/wrong-credentials'
import { Public } from '@infra/auth/public'
import { ZodValidationPipe } from '@infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateAccountByEmailController {
  constructor(
    private authenticateAccountByEmail: AuthenticateAccountByEmailUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateAccountByEmail.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentials:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { token } = result.value

    return {
      token,
    }
  }
}
