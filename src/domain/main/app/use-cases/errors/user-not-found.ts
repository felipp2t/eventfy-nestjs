import { UseCaseError } from 'src/core/errors/errors'

export class UserNotFound extends Error implements UseCaseError {
  constructor() {
    super('User not found')
  }
}
