import { CurrentUser } from '@infra/auth/current-user-decorator'
import { GoogleAuthGuard } from '@infra/auth/google-auth.guard'
import { GoogleCallbackPayload } from '@infra/auth/payloads/google-callback-payload'
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
