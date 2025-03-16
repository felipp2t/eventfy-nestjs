import { InvalidToken } from '@domain/main/app/use-cases/errors/invalid-token'
import { RefreshTokenUseCase } from '@domain/main/app/use-cases/refresh-token'
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

const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
})

type RefreshTokenBodySchema = z.infer<typeof refreshTokenBodySchema>

@Controller('/auth/refresh')
@Public()
export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(refreshTokenBodySchema))
  async handle(@Body() body: RefreshTokenBodySchema) {
    const { refreshToken } = body

    const result = await this.refreshTokenUseCase.execute({ refreshToken })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidToken:
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
