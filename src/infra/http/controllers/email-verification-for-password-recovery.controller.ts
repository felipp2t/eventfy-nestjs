import { EmailVerificationForPasswordRecoveryUseCase } from '@domain/main/app/use-cases/email-verification-for-password-recovery'
import { UserNotFound } from '@domain/main/app/use-cases/errors/user-not-found'
import { Public } from '@infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const emailVerificationForPasswordRecoveryBodySchema = z.object({
  email: z.string().email(),
})

type EmailVerificationForPasswordRecoveryBodySchema = z.infer<
  typeof emailVerificationForPasswordRecoveryBodySchema
>

@Controller('accounts/password-recovery/email-verification')
@Public()
export class EmailVerificationForPasswordRecoveryController {
  constructor(
    private readonly emailVerificationForPasswordRecoveryUseCase: EmailVerificationForPasswordRecoveryUseCase
  ) {}

  @Post()
  @HttpCode(202)
  @UsePipes(
    new ZodValidationPipe(emailVerificationForPasswordRecoveryBodySchema)
  )
  async handle(@Body() body: EmailVerificationForPasswordRecoveryBodySchema) {
    const { email } = body

    const result =
      await this.emailVerificationForPasswordRecoveryUseCase.execute({
        email,
      })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotFound:
          throw new NotFoundException(error.message)
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
