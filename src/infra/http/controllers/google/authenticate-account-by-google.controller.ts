import { AuthenticateByProviderUseCase } from '@domain/main/app/use-cases/authenticate-by-provider'
import { CurrentUser } from '@infra/auth/current-user-decorator'
import { GoogleCallbackPayload } from '@infra/auth/payloads/google-callback-payload'
import { GoogleAuthGuard } from '@infra/auth/providers/google/google-auth.guard'
import { Public } from '@infra/auth/public'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'

@Controller('accounts/google')
@Public()
export class AuthenticateByGoogleController {
  constructor(
    private authenticateByProviderUseCase: AuthenticateByProviderUseCase
  ) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async handle() {}

  @Get('/callback')
  @HttpCode(201)
  @UseGuards(GoogleAuthGuard)
  async handleCallback(@CurrentUser() user: GoogleCallbackPayload) {
    const { sub, email, name } = user

    const result = await this.authenticateByProviderUseCase.execute({
      sub,
      provider: AUTH_METHOD.GOOGLE,
      email,
      name,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }

    return {
      session: result.value.session,
    }
  }
}
