import { UseCaseError } from '../errors.js'

export class EmailAlreadyInUse extends Error implements UseCaseError {
  constructor() {
    super('The email is already in use')
  }
}
