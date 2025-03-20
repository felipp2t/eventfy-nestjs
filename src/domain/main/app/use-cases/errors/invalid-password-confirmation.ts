import { UseCaseError } from 'src/core/errors/errors'

export class InvalidPasswordConfirmation extends Error implements UseCaseError {
  constructor() {
    super('invalid password confirmation')
  }
}
