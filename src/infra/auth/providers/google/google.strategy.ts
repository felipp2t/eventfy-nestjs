import { googleCallbackPayloadSchema } from '@infra/auth/payloads/google-callback-payload'
import { EnvService } from '@infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

@Injectable()
export class GoogleStategy extends PassportStrategy(Strategy) {
  constructor(private readonly envService: EnvService) {
    super({
      clientID: envService.get('GOOGLE_CLIENT_ID'),
      clientSecret: envService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${envService.get('BASE_URL')}/accounts/google/callback`,
      scope: ['profile', 'email'],
    })
  }

  async validate(_: unknown, __: unknown, profile: Profile) {
    return googleCallbackPayloadSchema.parse({
      sub: profile._json.sub,
      email: profile._json.email,
      name: profile._json.name,
    })
  }
}
