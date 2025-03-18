import { CurrentUser } from '@infra/auth/current-user-decorator'
import { GoogleCallbackPayload } from '@infra/auth/payloads/google-callback-payload'
import { GoogleAuthGuard } from '@infra/auth/providers/google/google-auth.guard'
import { Public } from '@infra/auth/public'
import { Controller, Get, UseGuards } from '@nestjs/common'

@Controller('accounts')
@Public()
export class AuthenticateAccountByGoogleController {
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async handle() {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async handleCallback(@CurrentUser() user: GoogleCallbackPayload) {
    return { user }
  }
}
