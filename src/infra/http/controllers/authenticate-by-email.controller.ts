import { AuthenticateByEmailUseCase } from '@domain/main/app/use-cases/authenticate-by-email'
import { WrongCredentials } from '@domain/main/app/use-cases/errors/wrong-credentials'
import { Public } from '@infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateByEmailBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateByEmailSchema = z.infer<typeof authenticateByEmailBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateByEmailController {
  constructor(
    private readonly authenticateByEmailUseCase: AuthenticateByEmailUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateByEmailBodySchema))
  async handle(@Body() body: AuthenticateByEmailSchema) {
    const { email, password } = body

    const result = await this.authenticateByEmailUseCase.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentials:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
