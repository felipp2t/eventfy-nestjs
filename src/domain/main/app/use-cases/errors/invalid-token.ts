import { UseCaseError } from 'src/core/errors/errors'

export class InvalidToken extends Error implements UseCaseError {
  constructor() {
    super('Invalid token')
  }
}
