import { UserNotFound } from '@domain/main/app/use-cases/errors/user-not-found'
import { ValidateEmailUseCase } from '@domain/main/app/use-cases/validate-email'
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

const validateEmailBodySchema = z.object({
  email: z.string().email(),
})

type ValidateEmailBodySchema = z.infer<typeof validateEmailBodySchema>

@Controller('/validate-email')
@Public()
export class ValidateEmailController {
  constructor(private validateEmailUseCase: ValidateEmailUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(validateEmailBodySchema))
  async hadle(@Body() body: ValidateEmailBodySchema) {
    const { email } = body

    const result = await this.validateEmailUseCase.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotFound:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      token: result.value.token,
    }
  }
}
