import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './payloads/user-payload'
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
  }
)
