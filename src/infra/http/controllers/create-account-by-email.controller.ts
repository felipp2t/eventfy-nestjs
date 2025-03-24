import { CreateAccountByEmailUseCase } from '@domain/main/app/use-cases/create-account-by-email'
import { EmailAlreadyInUse } from '@domain/main/app/use-cases/errors/email-already-in-use'
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
import { passwordPolicy } from 'src/core/constants/password-policy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().refine(value => passwordPolicy.validate(value), {
    message: passwordPolicy.message,
  }),
})

type CreateAccountByEmailSchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountByEmailController {
  constructor(
    private readonly createAccountByEmailUseCase: CreateAccountByEmailUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async createAccountByEmail(@Body() body: CreateAccountByEmailSchema) {
    const { name, email, password } = body

    const result = await this.createAccountByEmailUseCase.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyInUse:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
