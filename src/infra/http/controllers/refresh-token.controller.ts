import { InvalidToken } from '@domain/main/app/use-cases/errors/invalid-token'
import { UserNotFound } from '@domain/main/app/use-cases/errors/user-not-found'
import { RefreshTokenUseCase } from '@domain/main/app/use-cases/refresh-token'
import { Public } from '@infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
})

type RefreshTokenSchema = z.infer<typeof refreshTokenBodySchema>

@Controller('/sessions/refresh')
@Public()
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(refreshTokenBodySchema))
  async handle(@Body() body: RefreshTokenSchema) {
    const { refreshToken } = body

    const result = await this.refreshTokenUseCase.execute({ refreshToken })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidToken:
          throw new ConflictException(error.message)
        case UserNotFound:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken, refreshToken: newRefreshToken } = result.value.session

    return {
      session: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    }
  }
}
