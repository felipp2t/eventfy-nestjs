import { GoogleAuthGuard } from '@infra/auth/google-auth.guard'
import { Public } from '@infra/auth/public'
import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

@Controller('auth/google')
@Public()
export class AuthenticateAccountByGoogleController {
  @Get()
  @UseGuards(GoogleAuthGuard)
  async handle() {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async handleCallback(@Req() request: Request) {
    console.log(request.user)
  }
}
